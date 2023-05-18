import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators, AbstractControl, FormGroup, FormControl} from '@angular/forms';
import {UserService} from "../../../../service/user.service";
import {newUser} from "../../../../domain/newUser";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {ToastrService} from "ngx-toastr";
import {FirebaseCodeErrorService} from "../../../../service/firebase-code-error.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  user: newUser= new newUser()

  eliminarAnterior=0;
  registerForm = this.fb.nonNullable.group(
    {
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],

    },
    {
      validators: [this.matchValidator('password', 'confirmPassword')],
    }
  );
  formReg: FormGroup;
  registrarUsuario: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder,private userService: UserService,private router: Router,
              private afAuth: AngularFireAuth,
              private toastr: ToastrService,
              private firebaseError: FirebaseCodeErrorService) {
    this.formReg = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
    this.registrarUsuario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repetirPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }



  /////////////////////////////////


  matchValidator(source: string, target: string) {
    return (control: AbstractControl) => {
      const sourceControl = control.get(source)!;
      const targetControl = control.get(target)!;
      if (targetControl.errors && !targetControl.errors.mismatch) {
        return null;
      }
      if (sourceControl.value !== targetControl.value) {
        targetControl.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        targetControl.setErrors(null);
        return null;
      }
    };
  }
  registrar() {
    const email = this.registrarUsuario.value.email;
    const password = this.registrarUsuario.value.password;
    const repetirPassowrd = this.registrarUsuario.value.repetirPassword;

    console.log(this.registrarUsuario);
    if (password !== repetirPassowrd) {
      this.toastr.error(
        'Las contraseñas ingresadas deben ser las mismas',
        'Error'
      );
      return;
    }

    this.loading = true;
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.verificarCorreo();
      })
      .catch((error) => {
        this.loading = false;
        this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
      });
  }

  verificarCorreo() {
    this.afAuth.currentUser
      .then((user) => user?.sendEmailVerification())
      .then(() => {
        this.toastr.info(
          'Le enviamos un correo electronico para su verificacion',
          'Verificar correo'
        );
        this.router.navigate(['/login']);
      });
  }


}
