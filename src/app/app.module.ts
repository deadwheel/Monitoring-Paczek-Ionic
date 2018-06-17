
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { HttpModule } from '@angular/http';
import { StatusZamWieniaPage } from '../pages/list_package/list_package'; 
import { ModalContentPP, ModalContentInPost } from './../pages/list_package/list_package';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

@NgModule({
  declarations: [
    MyApp,
  StatusZamWieniaPage,
  ModalContentPP,
  ModalContentInPost,
    HomePage
  ],
  imports: [
    BrowserModule,
	HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  StatusZamWieniaPage,
  ModalContentPP,
  ModalContentInPost,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
	BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
