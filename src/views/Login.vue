<script lang="ts" setup>
import _ from "lodash";
import { useRouter } from "vue-router";
import anime, { AnimeInstance } from "animejs";
import lottie, { AnimationItem } from "lottie-web";
import { ref, computed, onMounted, reactive, watch } from 'vue';
import Logo from "@/json/loginLogoAnimation.json";
import { mockPromise } from "@/utils/main";
import { login } from "@/api/auth-request";

interface tips {
  sTipTitle: string;
  sTipContent: string;
  sOpenUrl: string
}

interface extraLottie extends AnimationItem {
  finished?: Promise<void>
}

const rLoginLoading = ref({});

const state = reactive({
  isLoginShow: true,
  isLoginLoading: false,
  isShowPassword: false,
  isTipsShow: false,
  oLoginForm: {
    loginName: "",
    loginPassword: "",
    integrateId: 1
  },
  oTips: {
    sTipTitle: "",
    sTipContent: "",
    sOpenUrl: ""
  },
});

const isButtonDisabled = computed(() => {
  return (
    state.oLoginForm.loginPassword.length <= 0 ||
    state.oLoginForm.loginName.length <= 0 ||
    state.isLoginLoading
  );
})

const sPasswordType = computed(() => {
  return state.isShowPassword ? "text" : "password";
})

const handleResetPassword = () => {
  handleTipsShow({
    sTipTitle: "忘记密码",
    sTipContent: "请登录海智汇门户网站 p.haier.net重置密码，重置后登录叙数",
    sOpenUrl: "https://p.haier.net/"
  });
}

const handleCloseTips = () => {
  handleTipsShow({
    sTipTitle: "",
    sTipContent: "",
    sOpenUrl: ""
  })
  state.isLoginShow = true;
}

const { push } = useRouter();

const handleSubmitBtnClick = async () => {
  if (!state.isLoginLoading) {
    state.isLoginLoading = true;
    const resp = await mockPromise();
    const isSuccess = _.get(resp, "success", false);
    if (isSuccess) {
      await playLogoAnimation();
      push("/Home")
    } else {
      state.isLoginLoading = false;
    }
  }
}

function isExtraLottie(animationType: AnimeInstance | extraLottie): animationType is extraLottie {
    return (<extraLottie>animationType).goToAndPlay !== undefined;
}

const playLogoAnimation = async () => {
  let allAnimation: Array<extraLottie | AnimeInstance> = animeLogo ? [animeLogo] : [];
  allAnimation = allAnimation.concat(animeLoginSucc);
  return Promise.all(
    allAnimation.map(animation => {
      isExtraLottie(animation) ? animation.goToAndPlay(5, true) : animation.play()
      return animation.finished;
    })
  );
}

const handleOpenUrl = () => {
  window.open(state.oTips.sOpenUrl);
}

const handleTipsShow = (sTipsInfo: tips) => {
  state.oTips = sTipsInfo;
  state.isTipsShow = true;
  state.isLoginShow = false;
}

let animeLogo: extraLottie | null, animeLoading: AnimeInstance, animeLoginSucc: Array<AnimeInstance>, animeLoginFail: AnimeInstance;

watch(() => state.isLoginLoading, (val) => {
  if (val) {
    animeLoading.restart();
  } else {
    animeLoading.pause();
    animeLoginFail.restart();
  }
})

onMounted(() => {
  const createAnimeLogo = () => {
    const dom = document.getElementById("animeLogo");
    if (dom) {
      let animeLogo: extraLottie = lottie.loadAnimation({
        container: dom, // the dom element that will contain the animation
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: Logo // the path to the animation json
      });
      animeLogo.setSpeed(0.8);
      animeLogo.goToAndStop(50, true);
      let resolved: (value: (void | PromiseLike<void>)) => void
      animeLogo.addEventListener("complete", () => {
        resolved();
        animeLogo.finished = new Promise(resolve => {
          resolved = resolve;
        });
      });
      animeLogo.finished = new Promise(resolve => {
        resolved = resolve;
      });
      return animeLogo;
    }
    return null;
  }
  const createAnimeLoading = () => {
    return anime({
      targets: rLoginLoading.value,
      translateX: [-480, 480],
      loop: true,
      autoplay: false,
      duration: 2000,
      easing: "cubicBezier(0.420, 0.000, 0.145, 1.000)"
    });
  }

  const createAnimeLoginSucc = () => {
    return [
      anime({
        targets: ".header-logo",
        loop: false,
        autoplay: false,
        // top: [50, document.body.clientHeight / 2 - 60],
        translateY: [50, document.body.clientHeight / 2 - 60],
        scale: 3,
        duration: 2500,
        easing: "cubicBezier(0.08, 0.72, 0, 1.000)"
      }),
      anime({
        targets: [".el-main", ".el-footer"],
        loop: false,
        autoplay: false,
        translateY: 700,
        opacity: 0,
        duration: 200,
        easing: "cubicBezier(0.420, 0.000, 0.145, 1.000)"
      })
    ];
  }
  const createAnimeLoginFail = () => {
    return anime({
      targets: ".header-logo",
      loop: false,
      autoplay: false,
      keyframes: [
        { translateX: 0, rotateY: 0 },
        { translateX: -9, rotateY: -9 },
        { translateX: 8, rotateY: 7 },
        { translateX: -6, rotateY: -5 },
        { translateX: 5, rotateY: -3 },
        { translateX: 0, rotateY: 0 }
      ],
      duration: 500,
      easing: "cubicBezier(0.42,0,0.58,1)"
    });
  }
  animeLogo = createAnimeLogo();
  animeLoading = createAnimeLoading();
  animeLoginSucc = createAnimeLoginSucc();
  animeLoginFail = createAnimeLoginFail();
});


</script>

<template>
  <div id="login">
    <el-container style="height: 100%">
      <el-header height="1.2rem" style="text-align: center">
        <div class="header-logo" id="animeLogo"></div>
      </el-header>
      <el-main>
        <el-form v-show="state.isLoginShow" ref="ruleForm" :model="state.oLoginForm">
          <el-form-item>
            <span class="form-title">欢迎，数据探索者</span>
          </el-form-item>
          <el-form-item label prop="loginName">
            <el-input
              v-model="state.oLoginForm.loginName"
              autocomplete="new-password"
              class="userName"
              type="text"
              placeholder="工号"
            />
          </el-form-item>
          <el-form-item label prop="loginPassword">
            <el-input
              v-model="state.oLoginForm.loginPassword"
              autocomplete="new-password"
              class="password"
              placeholder="密码"
              :type="sPasswordType"
              @keyup.enter="handleSubmitBtnClick"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              ref="loginButton"
              class="submit"
              type="primary"
              :disabled="isButtonDisabled"
              @click.prevent="handleSubmitBtnClick"
            >登录</el-button>
          </el-form-item>
          <div
            class="main-resetPassword"
            :class="[state.isLoginLoading ? 'is-disabled' : '']"
            @click="handleResetPassword"
          >忘记密码</div>
          <div v-show="state.isLoginLoading" ref="rLoginLoading" class="login-loading"></div>
        </el-form>
      </el-main>
      <el-footer height="1.2rem">
        <div class="footer-tips">
          <p></p>
          <p class="explain">使用须知：请自觉遵守《海尔集团信息安全管理规范》，勿使用他人账户登录系统，以免造成个人信息及权限泄漏！</p>
          <p class="marginBottom"></p>
        </div>
      </el-footer>
    </el-container>
    <video
      autoplay
      class="video-content"
      loop
      muted
      height="100%"
      src="https://mss.cosmoplat.com/datateller-public/video/home_page_video_1.webm"
    />
    <el-dialog
      top="36.57vh"
      width="4.8rem"
      v-model="state.isTipsShow"
      :modal="false"
      @closed="handleCloseTips"
    >
      <template v-slot:title>{{ state.oTips.sTipTitle }}</template>
      {{ state.oTips.sTipContent }}
      <template v-slot:footer>
        <el-button v-if="state.oTips.sOpenUrl" type="primary" @click="handleOpenUrl">立即前往</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less">
#login {
  position: absolute;
  height: 100%;
  width: 100%;
  min-width: 10.32rem;
  min-height: 6.5rem;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;

  .el-button {
    border: none;
    background: #0474ff;
    font-size: 0.16rem;
    line-height: 0.3rem;
    height: 100%;
    width: 100%;

    &:active {
      width: calc(100% - 0.04rem);
    }

    &:hover {
      background: #308cff;
    }

    &.is-disabled {
      background: #81b9ff;
    }
  }

  .el-header {
    .header-logo {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      //bottom: 0;
      //transform: translateY(0.5rem);
      width: 2.35rem;
      height: 0.4rem;
      margin: auto;
    }
  }

  .el-main {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;

    .el-form {
      overflow: hidden;
      position: relative;
      width: 4.8rem;
      height: 4.2rem;
      margin: auto;
      padding: 0.5rem 0.32rem 0 0.32rem;
      text-align: center;
      background: hsla(0, 0%, 100%, 0.6);
      box-shadow: 0 0.3rem 0.6rem 0 rgba(0, 19, 43, 0.01),
        0 0.37rem 0.4rem 0 rgba(0, 25, 64, 0.02),
        0 0.1rem 0.3rem 0 rgba(0, 12, 48, 0.09),
        0 0 0 0.01rem rgba(255, 255, 255, 0.5) inset;
      border-radius: 0.04rem;
      backdrop-filter: blur(0.1rem);

      .login-loading {
        position: absolute;
        width: 4.78rem;
        height: 0.06rem;
        top: 0;
        left: 0;
        background: #0474ff;
      }

      .main-passwordImg {
        vertical-align: sub;
      }

      @keyframes scale {
        0% {
          width: 100%;
          line-height: 0.5rem;
        }
        50% {
          width: calc(100% + 0.01rem);
          line-height: 0.53rem;
        }
        100% {
          width: calc(100% + 0.02rem);
          line-height: 0.56rem;
        }
      }

      .el-input {
        &::placeholder {
          color: #999999;
        }

        .el-input__inner {
          border: none;
          color: #333333;
          height: 0.5rem;
          line-height: 0.5rem;
          background: hsla(0, 0%, 100%, 0.6);
          backdrop-filter: blur(0);
          animation: scale 0.3s cubic-bezier(0.42, 0, 0.145, 1) alternate;

          &:hover {
            background: hsla(0, 0%, 100%, 0.8);
          }

          &:focus {
            animation: scale 0.3s cubic-bezier(0.42, 0, 0.145, 1) forwards;
            background: hsla(0, 0%, 100%, 1);
          }
        }
      }

      .el-form-item:first-child {
        text-align: left;
        margin: 0 0 0.4rem 0;

        .form-title {
          font-weight: 500;
          color: #333333;
          font-size: 0.28rem;
        }
      }

      .el-form-item:nth-child(2) {
        .el-form-item__content {
          line-height: 0.5rem;
        }

        margin: 0 0 0.28rem 0;
      }

      .el-form-item:nth-child(3) {
        .el-form-item__content {
          line-height: 0.5rem;

          .el-input__suffix {
            right: 0.16rem;
          }
        }

        margin: 0 0 0.4rem 0;
      }

      .el-form-item:nth-child(4) {
        margin: 0 0 0.16rem 0;

        .el-form-item__content {
          line-height: 0.48rem;
        }
      }

      .main-resetPassword {
        cursor: pointer;
        color: #0474ffcc;

        &:hover {
          color: #0474ff;
          font-weight: 500;
        }

        &.is-disabled {
          cursor: not-allowed;
          color: #56a1ffff;
        }
      }
    }
  }

  .el-footer {
    padding: 0;
    background: hsla(0, 0%, 40%, 0.1);
    backdrop-filter: blur(0.06rem);

    .footer-tips {
      color: #ffffff;
      //font-weight: 400;
      font-size: 0.12rem;
      padding: 0.14rem 0 0 0;
      width: 10rem;
      margin: auto;

      p:not(:last-child) {
        margin: 0 0 0.08rem 0;
      }
    }
  }

  .video-content {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    object-fit: cover;
    z-index: -1;
  }

  .el-dialog {
    padding: 0.5rem 0.32rem;
    background: hsla(0, 0%, 100%, 0.6);
    box-shadow: 0 0.3rem 0.6rem 0 rgba(0, 19, 43, 0.01),
      0 0.37rem 0.4rem 0 rgba(0, 25, 64, 0.02),
      0 0.1rem 0.3rem 0 rgba(0, 12, 48, 0.09);
    border-radius: 0.04rem;
    border: 1px solid rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(0.1rem);

    .el-dialog__header {
      height: 0.4rem;
      margin: 0;
      padding: 0;
      font-size: 0.28rem;
      color: #333333;
      justify-content: space-between;

      .el-dialog__headerbtn {
        position: static;
      }
    }

    .el-dialog__body {
      padding: 0.4rem 0;
      line-height: 0.2rem;
    }

    .el-dialog__footer {
      padding: 0;
    }
  }
}

@media only screen and (max-height: 768px),
  only screen and (max-width: 1366px) {
  #login {
    .el-main {
      .el-form {
        width: 4.2rem;
        height: 4rem;
        padding: 0.4rem 0.32rem 0 0.32rem;

        .el-form-item:nth-child(2) {
          margin: 0 0 0.24rem 0;
        }

        .el-form-item:nth-child(3) {
          margin: 0 0 0.32rem 0;
        }
      }
    }
  }
}

@media only screen and (max-width: 1000px) {
  #login {
    .el-footer {
      display: none;
    }
  }
}
</style>
