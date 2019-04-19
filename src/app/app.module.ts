import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { MessagesComponent } from './messages/messages.component';
import { SearchPipe, TagPipe, SearchSubPagePipe } from './pipes/search.pipe';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PageComponent } from './page/page.component';

import { NavigationComponent } from './navigation/navigation.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SubpageComponent } from './subpage/subpage.component';
// import { DialogWindow, IconsDialog } from './opendialog/opendialog.component';

@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    MessagesComponent,
    NavigationComponent,
    HeaderComponent,
    SearchPipe,
    SearchSubPagePipe,
    TagPipe,
    FooterComponent,
    SubpageComponent,
    // DialogWindow, MatDialog, MatDialogRef,
    // IconsDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    // MatDialog, MatDialogRef, 
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
