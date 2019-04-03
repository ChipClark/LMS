import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { MessagesComponent } from './messages/messages.component';
import { SearchPipe, TagPipe } from './pipes/search.pipe';

import { AppComponent } from './app.component';
import { PageComponent } from './page/page.component';

import { NavigationComponent } from './navigation/navigation.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SubpageComponent } from './subpage/subpage.component';

@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    MessagesComponent,
    NavigationComponent,
    HeaderComponent,
    SearchPipe,
    TagPipe,
    FooterComponent,
    SubpageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
