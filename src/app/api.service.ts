import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, concat } from 'rxjs/operators';

import { Page, Tags, assoc_top_tag, SubPage } from './datatables/page';
import { MessageService } from './message.service';
import { identifierModuleUrl } from '@angular/compiler';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
 
@Injectable({
  providedIn: 'root'
})

export class APIService {

  public externalPageURL = 'http://am-web05:3035/api/v1/pages?filter={"include":["tags"]}'; 
  public externalPagePost = 'http://am-web05:3035/api/v1/pages';
  public externalTagsURL = 'http://am-web05:3035/api/v1/tags'; 
  public externalSubpageURL = 'http://am-web05:3035/api/v1/subpages';  
  public externalConnectionURL = 'http://am-web05:3035/api/v1/assocpagetags';

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

  postConnectTags(body):  Observable<assoc_top_tag[]>{
    return this.http.put<assoc_top_tag[]>(this.externalPagePost, body ).pipe( );
  }

  postPageData (body): Observable<Page[]> {
    let options = new Headers;
    console.log(body);

    return this.http.post<Page[]>(this.externalPagePost, body ).pipe( );
  }

  postSubpageData (body): Observable<SubPage[]> {
    let options = new Headers;
    console.log(body);

    return this.http.post<SubPage[]>(this.externalSubpageURL, body ).pipe( );
  }

  removeConnectTags(id: number): Observable<assoc_top_tag[]> {
    var delRecord = this.externalPagePost + "/" + id;
    return this.http.delete<assoc_top_tag[]>(delRecord).pipe();
  }

  removePageData (id: string): Observable<Page[]> {
    var delRecord = this.externalPagePost + "/" + id;
    return this.http.delete<Page[]>(delRecord).pipe();
  }

  removeSubpageData (id: string):Observable<SubPage[]> {
    var delRecord = this.externalSubpageURL + "/" + id;
    return this.http.delete<SubPage[]>(delRecord).pipe();
  }

  updateConnectTags(body):  Observable<assoc_top_tag[]>{
    return this.http.put<assoc_top_tag[]>(this.externalPagePost, body ).pipe( );
  }

  updatePageData (body): Observable<Page[]> {
    return this.http.put<Page[]>(this.externalPagePost, body ).pipe( );
  }

  updateSubpageData (body): Observable<SubPage[]> {
    let options = new Headers;
    console.log(body);

    return this.http.put<SubPage[]>(this.externalSubpageURL, body ).pipe( );
  }

}