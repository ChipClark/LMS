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

  private skip;
  private limit = 20;
  private lastRecord;
  private headers;
  top_page: Page[];
  tags: Tags[];
  subpage: SubPage[];
  connect_tags: assoc_top_tag[];
  
 
  constructor(
    private http: HttpClient,
    private messageService: MessageService){ }
 
  getPageData (url): Observable<Page[]> {
    return this.http.get<Page[]>(url)
      .pipe( );
  }

  getTagData (url): Observable<Tags[]> {
    return this.http.get<Tags[]>(url)
      .pipe( );
  }

  getSubpageData (url): Observable<SubPage[]> {
    return this.http.get<SubPage[]>(url)
      .pipe( 
        //tap(subpage => this.log(this.limit + " people returned")),
        //catchError(this.handleError('getPeople', [])),
      );
  }

  getConnectTags (url): Observable<assoc_top_tag[]> {
    return this.http.get<assoc_top_tag[]>(url)
      .pipe( );
  }



}