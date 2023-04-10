import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SunburstGraphComponent } from './sunburst-graph/sunburst-graph.component';
import { NgxDialogComponent } from './ngx-dialog/ngx-dialog.component'

@NgModule({
  declarations: [
    AppComponent,
    SunburstGraphComponent,
    NgxDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
