import { Pipe, PipeTransform } from '@angular/core';
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

