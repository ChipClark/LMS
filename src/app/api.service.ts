import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap, concat } from 'rxjs/operators';

import { Page, Tags, assoc_top_tag, SubPage } from './datatables/page';
import { MessageService } from './message.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable({
  providedIn: 'root'
})

export class APIService {

  public externalPageURL = 'http://marketing/utils/LMS/lms_page_svc.asp';  
  public externalTagsURL = 'http://marketing/utils/LMS/lms_tag_svc.asp'; 
  public externalSubpageURL = 'http://marketing/utils/LMS/lms_subpage_svc.asp';  
  public externalConnectionURL = '../assets/tempconnections.json';

  public internalPageURL = '../assets/temppage.json';
  public internalTagsURL = '../assets/temptags.json';
  public internalSubpageURL = '../assets/tempsubpage.json';
  public internalConnectionURL = '../assets/tempconnections.json';

  private internal = true;
  
  top_page: Page[];
  tags: Tags[];
  subpage: SubPage[];
  connect_tags: assoc_top_tag[];
  
 
  constructor(
    private http: HttpClient,
    private messageService: MessageService){ }

  
 
  getPageData (url): Observable<Page[]> {
    if ( url == this.internal ) {
      return this.http.get<Page[]>(this.internalPageURL).pipe( );
    }
    else {
      return this.http.get<Page[]>(this.externalPageURL).pipe( );
    }
      
  }

  getTagData (url): Observable<Tags[]> {
    if ( url == this.internal ) {
      return this.http.get<Tags[]>(this.internalTagsURL).pipe( );
    }
    else {
      return this.http.get<Tags[]>(this.externalTagsURL).pipe( );
    }
  }

  getSubpageData (url): Observable<SubPage[]> {
    if ( url == this.internal ) {
      return this.http.get<SubPage[]>(this.internalSubpageURL).pipe( );
    }
    else {
      return this.http.get<SubPage[]>(this.externalSubpageURL).pipe( );
    }
  }

  getConnectTags (url): Observable<assoc_top_tag[]> {
    if ( url == this.internal ) {
      return this.http.get<assoc_top_tag[]>(this.internalConnectionURL).pipe( );
    }
    else {
      return this.http.get<assoc_top_tag[]>(this.externalConnectionURL).pipe( );
    }
  }



}