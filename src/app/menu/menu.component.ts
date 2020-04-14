import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { HttpClient } from '@angular/common/http';
import { Datos } from '../interfaces/datos';
import { environment, position } from './../../environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  // GUARDA LOS DATOS DEL DESARROLLO OBTENIDOS DE LA RESPUESTA GET DEL API
  datosUsuario: Datos[];

  // PUESTO DEL USUARIO, SE UTILIZA PARA REGRESAR A LA RUTA HOME
  workPosition;

  constructor(private auth: AuthService,
              private router: Router,
              private token: TokenService,
              private httpClient: HttpClient) {

                this.workPosition = position.work_position;
                console.log('Puesto desde el menu: ' + this.workPosition);
               }

  ngOnInit() {
  }

  logout(event: MouseEvent) {
    event.preventDefault();
    this.token.remove();
    this.auth.changeAuthStatus(false);
    this.router.navigate(['/']);
  }

  /* obtenerDatos() {
    this.httpClient.get(environment.API_ENDPOINT + '/pisos/' + id).subscribe(
      (data: Datos[]) => {
        this.datosUsuario = data;
        console.log('INFORMACION DEL USUARIO');
        console.log(data);
      }
    );
  } */

}
