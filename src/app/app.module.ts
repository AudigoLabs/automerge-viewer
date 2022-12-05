import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxDiffModule } from 'ngx-diff';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxJsonViewerModule,
    NgxDiffModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
