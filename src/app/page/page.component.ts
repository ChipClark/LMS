// page.components.ts

import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl, SafeValue } from '@angular/platform-browser';
import { Page, Tags, assoc_top_tag, SubPage } from '../datatables/page';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchPipe, TagPipe } from '../pipes/search.pipe'
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
  public tag: any;
  public searchTerm = null;

  url: string;
  top_page: Page[];
  tags: Tags[];
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
    this.route.queryParamMap.subscribe(params => {
      const queryStrings: any = this.route.queryParamMap;
      this.executeQueryParams(queryStrings.source.value);
    });
  }

  getData(): any {
    //console.log(this.baseURL);
    this.staffService.getPageData(this.pageURL)
      .subscribe(top_page => {
        this.top_page = top_page;
        //console.log(top_page);
      });
    this.staffService.getTagData(this.tagsURL)
      .subscribe(tag => {
        this.tag = tag;
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

  addQueryParams(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    for (let i = 0; i < keys.length; i++) {
      switch (keys[i]) {
        case 'tag':
          this.tag= values[0];
          break;
      }
    }
    if (keys[0] === 'tag') {
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
    console.log(queryStrings);
    const queries = Object.entries(queryStrings);
    this.clearFilters();
    for (const q of queries) {
      switch (q[0]) {
        case 'tag':
          this.tag = q[1];
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
