import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AppRoutingModule } from './app-routing.module';
import { MessagesComponent } from './messages/messages.component';
import { SearchPipe, TagPipe, SearchSubPagePipe, SortPipe } from './pipes/search.pipe';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PageComponent } from './page/page.component';
import { SubpageComponent } from './subpage/subpage.component';

import { NavigationComponent } from './navigation/navigation.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NgbdModalOptions } from './page/modalwindow';

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
    SortPipe,
    FooterComponent,
    SubpageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, 
    NgbModule,
    CKEditorModule,
    // MatCheckboxModule,
    ReactiveFormsModule
  ],
  // providers: [{provide: MAT_CHECKBOX_CLICK_ACTION, useValue: 'check'}],
  providers: [],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
