import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ViewController, ModalController } from 'ionic-angular';
import moment from 'moment';

export class Zdarzenie {

	czas: string;
	kod: string;
	nazwaKodu: string;
	nazwaJednostki: string;
	konczace: boolean;


	constructor(czas: string, kod: string, nazwaKodu: string, nazwaJednostki: string, konczace: boolean ) {

		this.czas = czas;
		this.kod = kod;
		this.nazwaKodu = nazwaKodu;
		this.nazwaJednostki = nazwaJednostki;
		this.konczace = konczace

	}



}


export class DetailsInfo_PP {
	
	dataNadania: string;
	rodzajPrzesylki: string;
	urzadNadania: string;
	urzadPrzeznaczenia: string;
	status: number;
	zdarzenia: Array<Zdarzenie>;

	constructor(status: number) {

		this.status = status;

	}

	public FillAll(dataNadania: string, rodzajPrzesylki: string, urzadNadania: string, urzadPrzeznaczenia: string, 
	zdarzenia: Array<Zdarzenie>) {

		this.dataNadania = dataNadania;
		this.rodzajPrzesylki = rodzajPrzesylki;
		this.urzadNadania = urzadNadania;
		this.urzadPrzeznaczenia = urzadPrzeznaczenia;
		this.zdarzenia = zdarzenia;


	}


	
	
}


@Component({
	selector: 'modal_content_pp',
	templateUrl: 'modal_content_pp.html'
  })

export class ModalContentPP {

	InfoPaczkaPP: DetailsInfo_PP;

	constructor(public platform: Platform,public params: NavParams,public viewCtrl: ViewController) {

		this.InfoPaczkaPP = params.get("PP");
		//console.log(this.InfoPaczkaPP);

	}

	dismiss() {
		this.viewCtrl.dismiss();
	}




}



@Component({
	selector: 'modal_content_inpost',
	templateUrl: 'modal_content_inpost.html'
  })

export class ModalContentInPost {

	infoPaczkaInpost: any;
	statusyInPost: any;
	reversed:any;

	constructor(public platform: Platform,public params: NavParams,public viewCtrl: ViewController) {

		this.infoPaczkaInpost = params.get("INPOST");
		this.statusyInPost = params.get("STATUSY");
		if(this.infoPaczkaInpost && this.infoPaczkaInpost.tracking_details)
		this.reversed = this.infoPaczkaInpost.tracking_details.reverse();

	}

	getFullNameStatus(status: string) {

		if(this.statusyInPost) {

			
			for (let entry of this.statusyInPost["items"]) {
				if(status === entry["name"] ) {

					console.log("weszlo w arunek");
					//break;
					return entry["title"];
				
				}
			}
			
/* 			this.statusyInPost["items"].forEach(element2 => {

				if(status === element2["name"] ) {

					console.log("weszlo w arunek");
					break;
					//return element2["title"];
				
				}
			}); */

            

		}

		else return status;


	}

	getType() {


		switch(this.infoPaczkaInpost["type"]) {

			case "inpost_locker_standard":

				return "Przesyłka paczkomatowa standardowa";

			case "inpost_locker_allegro":

				return "Przesyłka paczkomatowa Allegro Paczkomaty InPost";

			case "inpost_locker_pass_thru":

				return "Przesyłka paczkomatowa Podaj Dalej";

			case "inpost_letter_allegro":

				return "Minipaczka Allegro InPost";

			case "inpost_courier_allegro":
			
				return "Przesyłka kurierska Allegro Kurier InPost";

			case "inpost_courier_standard":

				return "Przesyłka kurierska standardowa";

			case "inpost_courier_express_1000":

				return "Przesyłka kurierska z doręczeniem do 10:00";

			case "inpost_courier_express_1200":

				return "Przesyłka kurierska z doręczeniem do 12:00";

			case "inpost_courier_express_1700":

				return "Przesyłka kurierska z doręczeniem do 17:00";
		

			case "inpost_courier_palette":

				return "Przesyłka kurierska Paleta Standard";

			case "inpost_courier_local_standard":

				return "Przesyłka kurierska Lokalna Standardowa";

			case "inpost_courier_local_express":
			
				return "Przesyłka kurierska Lokalna Expresowa";

			case "inpost_courier_local_super_express":

				return "Przesyłka kurierska Lokalna Super Expresowa";

			default:

				return "Nieokreślony";
		}

	}

	getDate(data: string) {


		return moment(data, moment.ISO_8601).format("DD/MM/YYYY HH:mm");

	}

	dismiss() {
		this.viewCtrl.dismiss();
	}




}


@Component({
  selector: 'page-status-zam-wienia',
  templateUrl: 'list_package.html'
})

export class StatusZamWieniaPage {
  
	InfoPaczkaPP: DetailsInfo_PP;
	infoPaczkaInpost: any;
	numer: string;
	ostatniStatusPP: string;
	infoInPostStatusy: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {

	this.infoPaczkaInpost = navParams.get("INPOST");
	this.InfoPaczkaPP = navParams.get("PP");
	this.numer = navParams.get("numer");
	this.infoInPostStatusy = navParams.get("INPOST_STATUSY");
	//console.log(this.InfoPaczkaPP);
	//console.log(this.infoPaczkaInpost);

	if(this.InfoPaczkaPP) {

		if(this.InfoPaczkaPP.status == 0 || this.InfoPaczkaPP.status == 1)
		this.ostatniStatusPP = this.InfoPaczkaPP.zdarzenia[this.InfoPaczkaPP.zdarzenia.length-1].nazwaKodu+" "+this.InfoPaczkaPP.zdarzenia[this.InfoPaczkaPP.zdarzenia.length-1].czas;
		else this.ostatniStatusPP = "Brak informacji o statusie";
/* 		switch(this.ostatniStatusPP) {

			case "P_A":
				this.ostatniStatusPP="Awizo przesyłki";
			break;
			case "P_AK":
				this.ostatniStatusPP="Awizo przesyłki - korekta rezultatu ";
			break;
			case "P_D":
			this.ostatniStatusPP="Doręczenie";
			break;
			case "P_NAD":
			this.ostatniStatusPP="Nadanie";
			break;
			case "P_ND":
			this.ostatniStatusPP="Nieudane doręczenie";
			break;
			case "P_NDPD":
			this.ostatniStatusPP="Nieudane doręczenie - kolejna próba dziś ";
			break;
			case "P_NDPJ":
			this.ostatniStatusPP="Nieudane doręczenie - kolejna próba jutro";
			break;
			case "P_NDK":
				this.ostatniStatusPP="Nieudane doręczenie - korekta rezultatu ";
			break;
			case "P_NDZAP":
				this.ostatniStatusPP="Nieudane doręczenie - zatrzymana - adresat powiadomiony ";
			break;
			case "P_OWU":
			this.ostatniStatusPP="Odebranie przesyłki w urzędzie";
			break;
			case "P_A":
			this.ostatniStatusPP="Awizo przesyłki";
			break;
			case "P_A":
			this.ostatniStatusPP="Awizo przesyłki";
			break;
			case "P_A":
			this.ostatniStatusPP="Awizo przesyłki";
			break;
			case "P_A":
			this.ostatniStatusPP="Awizo przesyłki";
			break;


		} */

	}
  
  }


  getFullNameStatus(status: string) {

	if(this.infoInPostStatusy) {

		
		for (let entry of this.infoInPostStatusy["items"]) {
			if(status === entry["name"] ) {

				//console.log("weszlo w arunek");
				//break;
				return entry["title"];
			
			}
		}

		

	}

	else return status;


  }

  	getDate(data: string) {


		return moment(data, moment.ISO_8601).format("DD/MM/YYYY HH:mm");

	}


  openModalPP() {

	if(this.InfoPaczkaPP && (this.InfoPaczkaPP.status == 0 || this.InfoPaczkaPP.status == 1)) {	
		let modal = this.modalCtrl.create(ModalContentPP, {"PP": this.InfoPaczkaPP});
		modal.present();
	}

  }
  
  openModalInPost() {

	if(this.infoPaczkaInpost) {
		let modal = this.modalCtrl.create(ModalContentInPost, {"INPOST": this.infoPaczkaInpost, "STATUSY": this.infoInPostStatusy});
		modal.present();
	}

  }
  
  
  
  
  
}
