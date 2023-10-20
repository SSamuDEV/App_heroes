import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styles: [
  ]
})
export class HeroPageComponent implements OnInit {

  public hero?: Hero;

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router ) {}

/* Osea, lo que ocurre aquí es lo siguiente: con el activated route agarro la ruta actual, y con
.params accedo a los parámetros, entonces si me suscribo me va a dar el parámetro que haya introducido
por url. Sin embargo, metemos un switchMap, para cambiar la propiedad del subscribe diciendo que el
parámetro que necesito es igual a la función por la que me pasas el parámetro, pasando así la id.
Gracias a eso, tenemos el subscribe modificado y simplemente nos suscribimos y almacenamos esa
información dentro de un hero, que es del mismo tipo que me devuelve. */

  ngOnInit(): void {
    this.activatedRoute.params
    .pipe(
      delay(1000),
      switchMap( ({ id }) => this.heroesService.getHeroById( id )),
    ).subscribe ( hero => {
      if ( !hero ) return this.router.navigate(['/heroes/list']);
      this.hero = hero;
      console.log(hero);
      return;
    })
  }
}
