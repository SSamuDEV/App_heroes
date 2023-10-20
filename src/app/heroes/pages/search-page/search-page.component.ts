import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: [
  ]
})

export class SearchPageComponent {

  constructor(private heroesService: HeroesService, private router: Router) {}

  public searchInput = new FormControl('');
  public heroes: Hero[] = [];
  public selectedHero?: Hero;


  searchHero() {
    const value: string = this.searchInput.value || '';

    this.heroesService.getSuggestions(value)
    .subscribe( heroes => this.heroes = heroes);
  }

  @Input()
  onSelectedOption( event: MatAutocompleteSelectedEvent ) {
    console.log(event.option.value)

    if (!event.option.value) {
      this.selectedHero = undefined;
      return;
    }

    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);

    this.selectedHero = hero;

    return this.router.navigateByUrl(`/heroes/${ this.selectedHero.id }`);
  }

}
