import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {newUser} from "../domain/newUser";
import {error} from "protractor";
@Injectable({
  providedIn: 'root'
})
export class UserService {


  users: any;
  private userCollection: AngularFirestoreCollection<newUser>;

  constructor(private  afs:AngularFirestore) {
    this.userCollection = afs.collection<newUser>('Auth');
  }



  //metodos CRUD
  addUserFire(user: newUser){
    const id = this.afs.createId();
    user.uid=id;
    this.userCollection.doc(id).set(Object.assign({},user));

  }



  getUsers(){
    return this.afs
      .collection("posts")
      .snapshotChanges()
  }

  deleteUserFire(user: newUser){
    this.userCollection.doc(user.uid).delete();
    //return this.productsCollection.valueChanges();
  }
  updateProductFire(user: newUser){


    this.userCollection.doc(user.uid).set(Object.assign({}, user))
  }

  getUserFire(){
    return this.userCollection.valueChanges();
  }
  getUserFireById(user: newUser){
    return this.userCollection.doc(user.uid).valueChanges();
  }
  

}

