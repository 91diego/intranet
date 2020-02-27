import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { SnotifyService, SnotifyPosition, SnotifyToast } from 'ng-snotify';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public form = {
    email: null,
    password: null
  };

  public error = null;
  constructor(private login: LoginService,
              private token: TokenService,
              private router: Router,
              private auth: AuthService,
              private notificacion: SnotifyService,
              private ngxService: NgxUiLoaderService) { }

  ingresar() {
    this.login.login(this.form).subscribe(
      data => this.handleResponse(data, this.form),
      error => this.handleError(error)
    );
    this.ngxService.start(); // start foreground loading with 'default' id

    // Stop the foreground loading after 5s
    setTimeout(() => {
      this.ngxService.stop(); // stop foreground loading with 'default' id
    }, 1500);
  }

  // Respuesta
  handleResponse(data: any, informacionUsuario: any) {
    this.token.handle(data.access_token);
    this.auth.changeAuthStatus(true);
    this.router.navigate(['/home']);
    this.notificacion.success('¡Bienvenido ' + this.form.email + '!', 'Inicio de sesion exitoso', {
      placeholder: 'pruebas',
      showProgressBar: false,
      titleMaxLength: 200
    });
  }
  // Manejo de errores
  handleError(error) {
    this.error = error.error.error;
    this.form.email = null;
    this.form.password = null;
    this.notificacion.error('Usuario y/o contraseña incorrectos', 'Datos incorrectos', {
      placeholder: 'pruebas',
      showProgressBar: false,
      titleMaxLength: 200
    });
  }
  ngOnInit() { }

}
