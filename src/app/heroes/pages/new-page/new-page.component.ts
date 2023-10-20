import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup ({
    id:               new FormControl <string>(''),
    superhero:        new FormControl <string> ('', { nonNullable: true }),
    publisher:        new FormControl <Publisher>(Publisher.DCComics),
    alter_ego:        new FormControl <string>(''),
    first_appearance: new FormControl <string>(''),
    characters:       new FormControl <string>(''),
    alt_img:          new FormControl <string>(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' },
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar) {}


  get currentHero(): Hero {
    return this.heroForm.value as Hero;
  }


  ngOnInit(): void {

    // Si en el enlace no hay un edit, entonces tira millas porque crearemos uno de cero.
    if ( !this.router.url.includes('edit')) return;

    // Sino, actualizaremos un héroe con los datos que tiene insertados:
    this.activatedRoute.params
    .pipe(
      switchMap( ({ id }) => this.heroesService.getHeroById(id)), // De los parámetros me pasas la id
    ).subscribe( hero => { // Me suscribo y pregunto si me has devuelto un héroe.

      // En el caso de que no, pues me envías a la verga
      if ( !hero ) return this.router.navigateByUrl('/');

      // Si existe, con el reset automáticamente resetea el formulario entero del heroForm.
      this.heroForm.reset( hero );
      return;
    });

  }

  onSubmit():void {

    // Si el formulario es invalido te largas
     if ( this.heroForm.invalid ) return;

     // Si me pasas una id, entonces te actualiza el listado.
     if ( this.currentHero.id ) {
      this.heroesService.updateHero( this.currentHero )
        .subscribe( hero => {
          this.showSnackbar(`${ hero.superhero } updated!`)
        });
      return;
     }

     this.heroesService.addHero( this.currentHero )
     .subscribe( hero => {
      this.showSnackbar(`${ hero.superhero } added!`)
      this.router.navigateByUrl('/heroes/list');
     });
  }

  showSnackbar(message: string):void {
    this.snackbar.open(message, 'done', {
      duration: 2500,
    })
  }

  onDeleteHero() {

    if (! this.currentHero.id) throw Error("Id is required!");

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    // Mi version pocha GOD

    dialogRef.afterClosed().subscribe(result => {
      if (!result ) return;

      this.heroesService.deleteHero(this.currentHero.id)
      .subscribe( hero => {
        if ( !hero ) {
          throw Error('No se ha podido eliminar el héroe.')
        }

        this.showSnackbar('¡El héroe ha sido eliminado!');
        return this.router.navigateByUrl('/heroes/list');
      });

      console.log('deleted')
    });

    // Primera versión del pibe simple

    /*dialogRef.afterClosed().subscribe(result => {
      if (!result ) return;

      this.heroesService.deleteHero(this.currentHero.id)
      .subscribe( wasDeleted => {
        if ( wasDeleted )
          this.router.navigateByUrl('/heroes/list');
      })
    }) */


    // Segunda versión pro del pibe
/*
    dialogRef.afterClosed()
    .pipe(
      // El filter hace de barrera, solo pasa a la siguente si se cumple condición dentro.
      filter( (result: boolean) => result ),
      switchMap( () => this.heroesService.deleteHero(this.currentHero.id))
    )
    .subscribe( () => {
      this.router.navigateByUrl('/heroes/list')
    })

*/
  }
}
