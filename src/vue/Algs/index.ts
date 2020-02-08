import Vue from "vue";
import { Component, Watch, Inject } from "vue-property-decorator";
import Capture from "../../cuber/capture";
import Option from "../../common/option";
import Base64 from "../../common/base64";

@Component({
  template: require("./index.html")
})
export default class Algs extends Vue {
  @Inject("option")
  option: Option;

  tab = null;

  capture: Capture = new Capture();
  pics: string[][] = [];
  algs = require("./algs.json");
  width: number = 0;
  height: number = 0;

  resize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.width = Math.min(width, height) / 4;
  }

  mounted() {
    for (let i = 0; i < this.algs.length; i++) {
      this.pics.push([]);
    }
    this.resize();
    this.loop();
  }

  loop() {
    let ret = this.pics.some((group, idx) => {
      if (this.algs[idx].algs.length == group.length) {
        return false;
      }
      group.push(this.capture.snap(this.algs[idx].strip, this.algs[idx].algs[group.length].exp));
      return true;
    });
    if (!ret) {
      return;
    }
    requestAnimationFrame(this.loop.bind(this));
  }

  play(i: number, j: number) {
    let group = this.algs[i];
    let alg = this.algs[i].algs[j];
    let init = { scene: "(" + alg.exp + ")'", action: alg.exp, strips: group.strip };

    let json = JSON.stringify(init);
    let string = Base64.encode(json);
    let path = window.location.pathname;
    window.location.href = window.location.origin + path.substring(0, path.lastIndexOf("/")) + "/director.html" + "?" + string;
  }
}
