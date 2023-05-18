import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { AuthService } from '@core/authentication';
import {UserService} from "../../../../service/user.service";
import {newUser} from "../../../../domain/newUser";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {ToastrService} from "ngx-toastr";
import {FirebaseCodeErrorService} from "../../../../service/firebase-code-error.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formLogin: FormGroup;
  isSubmitting = false;
  loginUsuario: FormGroup;
  loading = false;

  loginForm = this.fb.nonNullable.group({
    username: ['ng-matero', [Validators.required]],
    password: ['ng-matero', [Validators.required]],
    rememberMe: [false],
  });

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService,private userService: UserService,

              private afAuth: AngularFireAuth,
              private toastr: ToastrService,
              private firebaseError: FirebaseCodeErrorService) {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
    this.loginUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }
  ngOnInit(): void {
  }
  //////////////////////////
  entrar() {
    const email = this.loginUsuario.value.email;
    const password = this.loginUsuario.value.password;

    this.loading = true;
    this.afAuth.signInWithEmailAndPassword(email, password).then((user) => {

        this.router.navigateByUrl('/dashboard')
        console.log("dashboard")

    }).catch((error) => {
      this.loading = false;
      this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
    })
  }
  //////////////////////////

  buscar(user: newUser) {
    this.userService.updateProductFire(user);

  }


  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  onSubmit() {
    this.userService.login(this.formLogin.value)
      .then(response => {

        console.log(response);
        console.log("entrando");
        this.router.navigateByUrl('/dashboard');
      })
      .catch(error => console.log(error));
  }

  onClick() {
    this.userService.loginWithGoogle()
      .then(response => {
        console.log(response);
        this.router.navigateByUrl('/dashboard');
      })
      .catch(error => console.log(error))
  }


  login() {
    this.isSubmitting = true;

    this.auth
      .login(this.username.value, this.password.value, this.rememberMe.value)
      .pipe(filter(authenticated => authenticated))
      .subscribe(
        () => this.router.navigateByUrl('/'),
        (errorRes: HttpErrorResponse) => {
          if (errorRes.status === 422) {
            const form = this.formLogin;
            const errors = errorRes.error.errors;
            Object.keys(errors).forEach(key => {
              form.get(key === 'email' ? 'username' : key)?.setErrors({
                remote: errors[key][0],
              });
            });
          }
          this.isSubmitting = false;
        }
      );
  }
}
