import { Pipe, PipeTransform } from '@angular/core';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Pipe({
    name: 'search'
})
export class SearchPipe implements PipeTransform {

    transform(items: any[], search: string): any {

        if (!items || !search) {
            return items;
        }
        const regExp = new RegExp(search, 'gi');
        const check = p => {
            return regExp.test(p.title) ||
                regExp.test(p.description) ||
                regExp.test(p.sidebar) ;
        };
        return items.filter(check);
    }
}

@Pipe({
    name: 'searchsub'
})
export class SearchSubPagePipe implements PipeTransform {

    transform(items: any[], searchsubpage: string): any {

        if (!items || !searchsubpage) {
            return items;
        }
        const regExp = new RegExp(searchsubpage, 'gi');
        const check = p => {
            return regExp.test(p.title) ||
                regExp.test(p.description) ;
        };
        return items.filter(check);
    }
}



@Pipe({
    name: 'tags',
    pure: false
})

export class TagPipe implements PipeTransform {

    transform(items: any[], tag: string): any {

        if (!items || !tag) {
            return items;
        }

        var filtertags: any[] = [];

        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items[i].tags.length; j++) {
                if (tag == items[i].tags[j]) {
                    filtertags.push(items[i]);
                }
            }
        }
        return filtertags;
    }

}

