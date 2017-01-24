### Questions which are still unclear:

 1. Load user data on app load (globally available object on load)
 2. Login stuff:
	- Check if user has already logged in (first load query)
	- Validate user with CouchDB
	- Store user data on device (reliable/simple)
	- retrieve user data from local storage


#### Possible solution for passing user data:

`NavController` and `NavParams`

```js
// this is a navigational model where the user data is passed as parameters of the NavController
export class UserData {
	constructor(private navCtrl: NavController){ }

	loadUser(userData: OSXU{}) {
		this.navCtrl.push(ExamplePage, OSXU); // the data are the params of NavController
	}
}

// ----------------

export class ExamplePage implements OnInit{
	userData: OSXU{};

	constructor(private navParams: NavParams){ }

	ngOnInit(){
		this.userData = this.navParams;
	}
}
