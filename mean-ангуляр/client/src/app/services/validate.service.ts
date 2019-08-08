import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user) {
    if (user.name === undefined || user.email === undefined || user.username === undefined || user.password === undefined) {
      console.log(user);
      return false;
    } else {
      console.log(user);
      return true;
    }
  }

  validateEmail(email) {

    // RegExp is a bad idea, but:
    //const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // unicode:
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    // 99.9%:
    //const re = [a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?;
    // fresh:
    //const re = (?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]);
    console.log(re.test(email));
    return re.test(email);

/*
    // hardcoded validation:
    if(document.forms[0].c_email.value) {
      var add = document.forms[0].c_email.value;
      var ampisthere = false;
      var spacesthere = false;

      var textbeforeamp = false;
      var textafteramp = false;
      var dotafteramp = false;
      var othererror = false;

      for(var i = 0; i < add.length; ++i) {
          if(add.charAt(i) == '@') {
              if(ampisthere)
                  othererror = true;

                  ampisthere = true;
                } else if(!ampisthere)
                textbeforeamp = true;

                else if(add.charAt(i) == '.')
                dotafteramp = true;

                else
                textafteramp = true;

                if(add.charAt(i) == ' ' || add.charAt(i) == ',')
                spacesthere = true;

    }

      if(spacesthere || !ampisthere || !textafteramp || !textbeforeamp || !dotafteramp || othererror) {
          error += "\tEmail addresses must be valid working";
          error += " addresses with no commas or spaces\n";
        }
      }
*/
    // server-side library, best solution https://github.com/hapijs/isemail

    // angular validation - https://github.com/TheSharpieOne/angular-validation-match
    }

}
