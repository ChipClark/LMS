// page.components.ts

import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { Page, Tags, assoc_top_tag, SubPage } from '../datatables/page';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { debugOutputAstAsTypeScript } from '@angular/compiler';

// datatables 


@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css'],
})

@Injectable({
  providedIn: 'root'
})


export class PageComponent implements OnInit {

  public pageURL = '../assets/temppage.json';
  public tagsURL = '../assets/temptags.json';
  public subpageURL = '../assets/tempsubpage.json';
  public connectionURL = '../assets/tempconnections.json';

  // Filters
  
  //includes

  @ViewChildren('nGForArray') filtered;
  public tags: any;

  public searchTerm = null;
  public tagTerm = null;
  public tagname: any;

  url: string;
  top_page: Page[];
  filtertags: Tags[];
  subpage: SubPage[];
  connect_tags: assoc_top_tag[];

  
  //completePerson: PersonPage[];
  router: RouterLink;

  constructor(
    private staffService: APIService,
    private http: HttpClient,
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.getData();
    this.getParams();
  }

  getData(): any {
    //console.log(this.baseURL);
    this.staffService.getPageData(this.pageURL)
      .subscribe(top_page => {
        this.top_page = top_page;
        //console.log(top_page);
      });
    this.staffService.getTagData(this.tagsURL)
      .subscribe(filtertags => {
        this.filtertags = filtertags;

        console.log(this.filtertags);
        for (let i = 0; i < filtertags.length; i++) {
          if(filtertags[i]) {
            this.tagname[i] = filtertags[i].tagname;
          }
          
        }
        //console.log(tag);
      });
    
    this.staffService.getSubpageData(this.subpageURL)
      .subscribe(subpage => {
        this.subpage = subpage;
      });
    this.staffService.getConnectTags(this.connectionURL)
      .subscribe(connect_tags => {
        this.connect_tags = connect_tags;
        //console.log(connect_tags);
      });
  }

  getParams(): void {
    this.route.queryParamMap.subscribe(params => {
      const queryStrings: any = this.route.queryParamMap;
      this.executeQueryParams(queryStrings.source.value);
    });
  }

  addQueryParams(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    for (let i = 0; i < keys.length; i++) {
      switch (keys[i]) {
        case 'tags':
          this.tags= values[0];
          break;
      }
    }
    if (keys[0] === 'tags') {
      this._router.navigate([''], {
        queryParams: {
          ...query
        }
      });
    } else {
      if (query === "") {
        query = null;
      }
      this._router.navigate([''], {
          queryParams: {
            ...query
          },
          queryParamsHandling: 'merge',
        });
    }
  }

  executeQueryParams(queryStrings): void {
    const queries = Object.entries(queryStrings);
    this.clearFilters();
    for (const q of queries) {
      switch (q[0]) {
        case 'tags':
          this.tags = q[1];
          break;
        case 'search':
          this.searchTerm = q[1];
          break;

      }
    }
  }

  clearFilters() {
    this.searchTerm = null;
    this.tags = null;
  }


}
