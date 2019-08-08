import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router'; // for redirections
import { FlashMessagesService } from 'ngx-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() { }

  onRegisterSubmit() {
    //console.log(123); // test1
    //console.log(this.name); // test2
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

    // required fields
    if (!this.validateService.validateRegister(user)) {
      this.flashMessage.show('Please fill in all fields', { classes: ['alert-danger'], timeout: 3000 });
      return false;
    }
    // required email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show('Please use a valid email', { classes: ['alert-danger'], timeout: 3000 });
      return false;
    }

    // add to prod-level: rate-limiting, more error-handlers (404, 500 etc), social-auth, etc

    // register user
    this.authService.registerUser(user)
                    .subscribe(data => {
                      if (data.success) {
                        this.flashMessage.show('You are now registered and can log in', { classes: ['alert-success'], timeout: 3000 });
                        this.router.navigate(['/login']);
                      } else {
                        this.flashMessage.show('Something went wrong', { classes: ['alert-danger'], timeout: 3000 });
                        this.router.navigate(['/register']);
                      }
                    });
  }

}
