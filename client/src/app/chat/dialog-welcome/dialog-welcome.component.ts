import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../shared/model/user';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-dialog-welcome',
  templateUrl: './dialog-welcome.component.html',
  styleUrls: ['./dialog-welcome.component.css'],
})
export class DialogWelcomeComponent implements OnInit {
  avatar = {
    source: 'random',
    instagramAvatarUrl: '',
    randomAvatarUrl: '',
  };
  instagramNickname: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public user: User,
    public dialogRef: MatDialogRef<DialogWelcomeComponent>,
    private apiService$: ApiService,
  ) { }

  ngOnInit() {
    this.setRandomAvatar();
  }

  setRandomAvatar() {
    const randomId = this.getRandomId();
    this.avatar.randomAvatarUrl = `https://api.adorable.io/avatars/80/${randomId}`;
  }

  setInstagramAvatar() {
    if (!this.instagramNickname) {
      return;
    }
    this.apiService$.getAvatar(this.instagramNickname).subscribe(
      (res) => {
        this.avatar.instagramAvatarUrl = res.graphql.user.profile_pic_url;
      },
    );
  }

  getRandomId(): number {
    return Math.ceil(Math.random() * 100000);
  }

  onSave(): void {
    this.user.id = this.getRandomId();

    this.user.avatar = this.avatar.source === 'instagram' ? this.avatar.instagramAvatarUrl : this.avatar.randomAvatarUrl;

    this.dialogRef.close(this.user);
  }
}
