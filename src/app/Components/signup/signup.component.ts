import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service'
import { FormGroup ,Validators} from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import {ConfirmedpasswordService} from '../../services/confirmedpassword.service'
import { Router } from '@angular/router'
import * as AOS from 'aos';
import { AlertService } from 'src/app/_alert';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  errors:any = []
  options = {
    autoClose: true,
    keepAfterRouteChange: true
};

  profileForm = this.fb.group({
    firstname: ['', [Validators.required,Validators.minLength(2),Validators.maxLength(15)]],
    lastname: ['', [Validators.required,Validators.minLength(2),Validators.maxLength(15)]],
    email: ['',[Validators.required,Validators.email,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$")]],
    username:['',[Validators.required,Validators.minLength(2),Validators.maxLength(20)]],
    mobile:['',[Validators.required,Validators.pattern("^01[0-2]{1}[0-9]{8}")]],
    password:['',[Validators.required,Validators.minLength(8),Validators.maxLength(30)]],
    confirmpassword:['',Validators.required] },
    { 
    validator:this.confirmedPassword.passwordMatchValidator("password","confirmpassword")
      
    })

  constructor(private auth:AuthenticationService ,
              private route:Router ,
              private fb: FormBuilder,
              private confirmedPassword:ConfirmedpasswordService,
              protected alertService: AlertService
              ) { 
    if (localStorage.getItem('token')){
      this.route.navigate(['/home'])
    }
  }

  ngOnInit(): void {
    AOS.init();
  }

  UserRegester(username:string , email:string , password:string ,re_password:string, first_name:string , last_name:string  , mobile:string) {
    this.auth.register(username , email,password , re_password , first_name , last_name , mobile).subscribe(
      (data:any)=>  {
        this.alertService.success('Thanks for register please login now', this.options)
        this.route.navigate(['/login'])
      },
      (err) => {
        console.log(err);
        for (let i in err.error){
          // console.log(err.error[i])
          for (let e in err.error[i]){
            this.errors.push(err.error[i][e])
          }

        }
      }
    );
  }

  ConfirmedValidator(controlName: string, matchingControlName: string){

    return (formGroup: FormGroup) => {

        const control = formGroup.controls[controlName];

        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {

            return; 

        }

        if (control.value !== matchingControl.value) {

            matchingControl.setErrors({ confirmedValidator: true });

        } else {

            matchingControl.setErrors(null);

        }

    }
}}
