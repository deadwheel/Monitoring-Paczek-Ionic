import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { BarcodeScanner ,BarcodeScannerOptions } from '@ionic-native/barcode-scanner'; 
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
import { StatusZamWieniaPage } from '../list_package/list_package';
import xml2js from 'xml2js';
import { DetailsInfo_PP, Zdarzenie } from '../list_package/list_package';
import {Convert, Welcome} from '../list_package/inpost';
import { ConvertSt,Statusy } from '../list_package/inpost_statusy';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  scanData : {};
  options :BarcodeScannerOptions;

  jsonResponse: any;
  xmlResponse: string;
  message: string;
  resultLabel: string;
  showDiagnostic: boolean = false; 
  errorsd: string;
  InfoPaczkaPP: DetailsInfo_PP;
  infoPaczkaInpost: any;
  infoInPostStatusy: any;
  numer_przesylki: string;

  constructor(
    private http: Http, public navCtrl: NavController,private barcodeScanner: BarcodeScanner,
    public loadingCtrl: LoadingController, private httpsd: Http, private httpst: Http
  ) { }
  
  
  
  test() {
    
    let loading = this.loadingCtrl.create({

      content: "Loading...",
      dismissOnPageChange: true

    })

    loading.present();


		let text_xml: string = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Header>
    <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
      <wsse:UsernameToken>
        <wsse:Username Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">sledzeniepp</wsse:Username>
        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">PPSA</wsse:Password>
        <wsse:Nonce Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">aepfhvaepifha3p4iruaq349fu34r9q</wsse:Nonce>
        <wsu:Created Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">1523446111642</wsu:Created>
      </wsse:UsernameToken>
    </wsse:Security>
  </soap:Header>
  <soap:Body>
  <sled:sprawdzPrzesylke xmlns:sled="http://sledzenie.pocztapolska.pl">
      <sled:numer>`+this.numer_przesylki+`</sled:numer>
    </sled:sprawdzPrzesylke>
  </soap:Body>
</soap:Envelope>`;
		
		
        let gsxx = this.httpsd.post("https://tt.poczta-polska.pl/Sledzenie/services/Sledzenie?wsdl", text_xml, "").toPromise().then(
          response => {
            this.xmlResponse = response.text();
            xml2js.parseString(this.xmlResponse, { ignoreAttrs : true, explicitArray: false }, (error, result) => {
      
              if (error) {
                throw new Error(error);
              } else {
                this.jsonResponse = result;
                let bodyJson = this.jsonResponse["soapenv:Envelope"]["soapenv:Body"]["ns:sprawdzPrzesylkeResponse"]["ns:return"];


                this.InfoPaczkaPP = new DetailsInfo_PP(bodyJson["ax21:status"]);

                if(this.InfoPaczkaPP.status == 1 || this.InfoPaczkaPP.status == 0) {

                  let danePzesylki = bodyJson["ax21:danePrzesylki"];
                  let zdaenie = danePzesylki["ax21:zdarzenia"];
                  let zdarzeniaArray: Array<Zdarzenie> = new Array;

                  for(let dx of zdaenie["ax21:zdarzenie"]) {

                    let noweZdarzenie = new Zdarzenie(dx["ax21:czas"],dx["ax21:kod"],dx["ax21:nazwa"],
                    dx["ax21:jednostka"]["ax21:nazwa"], dx["ax21:konczace"]
                    );

                    zdarzeniaArray.push(noweZdarzenie);

                  }

                  this.InfoPaczkaPP.FillAll(danePzesylki["ax21:dataNadania"],
                    danePzesylki["ax21:rodzPrzes"],
                    danePzesylki["ax21:urzadNadania"]["ax21:nazwa"],
                    danePzesylki["ax21:urzadPrzezn"]["ax21:nazwa"],
                    zdarzeniaArray
                  );

                }
                

              }
        
            });

          },
          err => {
            console.log("Error calling ws", err);
          }
        );




        // INPOST

        let gsx = this.http.get("https://api-shipx-pl.easypack24.net/v1/tracking/"+this.numer_przesylki).toPromise().then(


          response => {

            this.infoPaczkaInpost = Convert.toWelcome(response.text());

          },

          err => {

            console.log("Error calling ws", err);
            this.infoPaczkaInpost = null;

          }
        );

        let statusyInPostGet = null;

        if(!this.infoInPostStatusy) {

           statusyInPostGet = this.httpst.get("https://api-shipx-pl.easypack24.net/v1/statuses").toPromise().then(
            response => {

              this.infoInPostStatusy = ConvertSt.toStatusy(response.text());
              console.log("Poszło statusy");

            },

            error => {

              console.log("Error calling ws", error);
              this.infoInPostStatusy = null;

            }

          );

        }
    
        Promise.all([gsx,gsxx,statusyInPostGet]).then(

          dupa => {

            if(this.infoPaczkaInpost && this.infoInPostStatusy) {

              this.infoPaczkaInpost["tracking_details"].forEach(element => {
                
                this.infoInPostStatusy["items"].forEach(element2 => {

                  if(element["status"] === element2["name"] ) console.log(element2["title"]);
                  
                });

              });

            }

            console.log(this.infoInPostStatusy);
            this.navCtrl.push(StatusZamWieniaPage, {
              PP: this.InfoPaczkaPP,
              INPOST: this.infoPaczkaInpost,
              INPOST_STATUSY: this.infoInPostStatusy,
              numer: this.numer_przesylki
            });
          },

          rej => {

            this.navCtrl.push(StatusZamWieniaPage, {
              PP: this.InfoPaczkaPP,
              INPOST: this.infoPaczkaInpost,
              INPOST_STATUSY: this.infoInPostStatusy,
              numer: this.numer_przesylki
            });

            console.log("rejected");

          }


        );
	  
  }
  
  
  
  
  scan() {
	  
	  this.options = {
		  
			prompt : "Zeskanuj kod kreskowy / QR"
		  
	  }
	  this.barcodeScanner.scan(this.options).then((barcodeData) => {
		  
      console.log(barcodeData);
      if(!barcodeData.cancelled) {
        this.numer_przesylki = barcodeData.text;
        this.test();
      }
	  }, (err) => {
		  
		  console.log("Error occured : "+err);
		  
	  });
		  
		  
		  
		  
	  }
	  
	  
	  
	  
	  
	  
	sprForm() {
    if(this.numer_przesylki) {
      this.errorsd = "";
      this.test();
    }

    else {

      this.errorsd = "Puste pole , wpisz numer przesyłki albo przeskanuj";

    }
			
	}
	  
	  
  }

