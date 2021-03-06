<template>
  <div id="profil">
    <div class="profileInfos">
      <h1> {{name}}</h1>
    </div>

    <div class="profileInfos">
      <h2> {{email}}</h2>
    </div>

    <div v-if="userSearchResult">
      <v-btn v-on:click="unfollow" v-if="alreadyFollow">UNFOLLOW</v-btn>
      <v-btn v-on:click="follow" v-else>FOLLOW</v-btn>
    </div>

    <div class="profileInfos" id="playlistsInfos">
      <h3>Playlists</h3>

      <cover-list
        type="playlist"
        :covers="playlists"
        :wrap="false"
      ></cover-list>
    </div>

    <div id="followingInfos">
      <h3>Following</h3>
      <div id="following">
        <div class="followingElements" v-for="(value, i) in following" :key="value.id || i" v-on:click="goToOtherProfile(value.id)">
          <v-avatar size="75px" id="avatar">
            <img src="~@/assets/images/generic-avatar.png">
          </v-avatar>
          <span>Name: {{ value.name }}</span>
          <span>Email: {{ value.email }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import ubeat from '@/js/apis/ubeat'
import CoverList from '@/components/CoverList'

export default {
  name: 'userProfile',
  components: {
    CoverList
  },
  data () {
    return {
      userId: '',
      myId: '',
      playlists: [],
      newPlayListName: '',
      name: '',
      email: '',
      following: [],
      userSearchResult: false,
      alreadyFollow: false
    }
  },
  async beforeRouteUpdate (to, from, next) {
    await this.fetchData()
    next()
  },
  async mounted () {
    await this.fetchData()
  },
  methods: {
    async fetchData () {
      await this.setMyId()
      if (this.$route.params.userTargetId) {
        this.userSearchResult = true
        const infosUser = await ubeat.getUserInfos(this.$route.params.userTargetId)
        this.userId = infosUser.id
        this.name = infosUser.name
        this.email = infosUser.email
        this.userSearchResult = true
        this.alreadyFollow = await this.determineIfFollowed(this.userId)
      } else {
        const cookie = Cookies.get('uBeatCookie')
        if (cookie) {
          const user = await ubeat.tokenInfo(cookie)
          this.userId = user.id
          this.name = user.name
          this.email = user.email
        } else {
          this.$router.push('/login')
        }
      }
      this.loadPlaylists(this.userId)
      this.loadFollowing(this.userId)
    },
    async loadPlaylists (userId) {
      this.playlists = await ubeat.getUserPlaylists(userId)
    },
    async loadFollowing (userId) {
      const infosUser = await ubeat.getUserInfos(userId)
      this.following = infosUser.following
    },
    async setMyId () {
      const cookie = Cookies.get('uBeatCookie')
      if (cookie) {
        const user = await ubeat.tokenInfo(cookie)
        this.myId = user.id
      }
    },
    goToOtherProfile (otherUserId) {
      this.$router.push(`/profile/${otherUserId}`)
    },
    async follow () {
      if (this.myId) {
        if (this.userId && this.userId !== this.myId) {
          await ubeat.follow(this.userId, Cookies.get('uBeatCookie'))
        }
        this.alreadyFollow = true
      } else {
        this.$router.push('/login')
      }
    },
    async unfollow () {
      if (this.myId) {
        if (this.userId && this.userId !== this.myId) {
          await ubeat.unfollow(this.userId, Cookies.get('uBeatCookie'))
          this.alreadyFollow = false
        }
      } else {
        this.$router.push('/login')
      }
    },
    async determineIfFollowed (targetUserId) {
      let followed = false
      if (this.myId) {
        const infosUser = await ubeat.getUserInfos(this.myId)
        const following = infosUser.following
        if (following.find(user => user.id === targetUserId)) {
          followed = true
        }
      }
      return followed
    }
  }
}
</script>

<style scoped>
  .profileInfos {
    margin-top: 30px;
  }

  .profileInfos > h3 {
    margin-top: 5vw;
    margin-bottom: 2vw;
  }

  .followingElements {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    margin-bottom: 1vw;
    margin-right: 5vh;
    width: 150px;
  }

  #followingInfos  > h3{
    margin-bottom: 2vw;
  }

  #following {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
  }

  #avatar {
    margin-right: auto;
    margin-left: auto;
    margin-bottom: 15px;
  }

  #profil {
    margin: 30px;
  }
</style>
