// subpage.components.ts

import { Component, OnInit, Input, ViewChild, ViewChildren } from '@angular/core';
import { DomSanitizer,  } from '@angular/platform-browser';
import { Page, SubPage, RelatedPages } from '../datatables/page';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component';

import { PageComponent } from '../page/page.component';

// datatables 

@Component({
  selector: 'app-page',
  templateUrl: './subpage.component.html',
  styleUrls: ['./subpage.component.css'],
})

@Injectable({
  providedIn: 'root'
})

export class SubpageComponent implements OnInit {

  @ViewChildren('nGForArray') filtered;
  public subsearchTerm = null;
  public topTitle;
  public queryStrings;
  public tags: any;
  public tag = null;
  public searchTerm = null;
  public tagname: any;

  // subpage structure
  public id;
  public title;
  public description;
  public icon;
  public isactive;
  public urltarget;
  public pageid;
  public relatedPage;

  public isCurrent = false;
  public isPageFormVisible = false;

  url: string;
  relatedPages: RelatedPages[];
  top_page: Page[];
  top_category: Page;
  subpage: SubPage[];
  subpageitems: SubPage[];
  formPage: FormGroup; 

  
  //completePerson: PersonPage[];
  router: RouterLink;

  constructor(
    private apiService: APIService,
    private mainApp: AppComponent,
    private http: HttpClient,
    protected sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private _router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.getParams();
    this.getData();
  }

  addSubQuery(query): void {
    const keys = Object.keys(query);
    const values = Object.values(query);
    if (query === "") {
      query = null;
    }
    this._router.navigate(['course'], {
        queryParams: {
          ...query
        },
        queryParamsHandling: 'merge',
      });
  }

  clearFilters() {
    this.subsearchTerm = null;
  }

  clearForm(currentForm: Page): void {
    this.title = "";
    this.pageid = "";
    this.description = "";
    this.icon = "";
    this.isactive = null;
    this.url = null;
    this.urltarget = "";
    this.id = null;
  }

  clickTag(tag: string): void {
    console.log(tag);
  }

  createRequest(): void {
    if (this.isactive = "true") {
      this.isactive = true;
    }
    else this.isactive = false;
    
    const body = {
      "pageid": this.pageid,
      "title": this.title,
      "description": this.description,
      "icon": this.icon,
      "isactive": this.isactive,
      "url": this.url,
      "urltarget": this.urltarget
    };

    this.apiService.postSubpageData(body)
      .subscribe(
        (p: any) => {
          p = this.subpage;
        }
      );
  }

  deleteRequest(): void {
    this.apiService.removeSubpageData(this.id)
      .subscribe(
        (p: any) => {
          p = this.subpage;
        }
      );

  }

  editPages(): void {
    

    for (let i = 0; i < this.top_page.length; i++) {
      console.log(this.top_page);
      break;
      if (!this.top_page[i]) {
        break;
      }
      
      this.title = (this.top_page[i].title);
      console.log(this.title);
      this.relatedPages.push(this.title);
    }
    console.log(this.relatedPages);
  }

  executeQueryParams(queryStrings): void {
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


  fillform(single_page): void {
    this.isPageFormVisible = true;
    this.title = single_page.title;
    this.description = single_page.description;
    this.icon = single_page.icon;
    this.isactive = single_page.isactive;
    this.pageid = single_page.pageid;
    this.id = single_page.id
    this.isCurrent = true;
    this.relatedPage = this.top_page.find( p => {
      return p.id === this.pageid}).title
  }

  getData(): any {
    this.apiService.getPageData(this.mainApp.internal_db)
      .subscribe(top_page => {
        this.top_page = top_page;
        
        this.apiService.getSubpageData(this.mainApp.internal_db)
          .subscribe(subpage => {
            this.subpage = subpage;
            this.subpageitems = [];
            for ( let i = 0; i < this.subpage.length; i++ ) {
                this.subpageitems.push(this.subpage[i]);
            }
          });
      });
  }

  getTopTitle(): void {
    let obj;
    this.route.queryParams.subscribe(p => {
      obj = p;
    });
    this.topTitle = Object.values(obj);
  }

  getParams(): void {
    this.route.queryParamMap.subscribe(params => {
      this.queryStrings = this.route.queryParamMap;
      // this.executeSubQuery(this.queryStrings.source.value);
    });
  }

  updateRequest(): void {
    if (this.isactive = "true") {
      this.isactive = true;
    }
    else this.isactive = false;
    
    const body = {
      "id": this.id,
      "pageid": this.pageid,
      "title": this.title,
      "description": this.description,
      "icon": this.icon,
      "url": this.url,
      "urltarget": this.urltarget,
      "isactive": this.isactive,
    };

    this.apiService.updateSubpageData(body)
      .subscribe(
        (p: any) => {
          p = this.subpage;
        }
      );
  }
  
}