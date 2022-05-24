//prep
import React from "react";
import emailjs from "@emailjs/browser"
import Style from '../styles/session.module.scss';

import {Navigate} from 'react-router-dom'

import takepic from '../assets/image/button/takepic.png'

import {MdChevronLeft, MdChevronRight} from 'react-icons/md'

import {Carousel} from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import bgstar from "../assets/image/star.png"
import bgwhitepolos from "../assets/image/bgwhitepolos.png";
import bgproductspolos from "../assets/image/bgproductspolos.png";
import bgbaru from "../assets/image/bgbaru.png"
import bgnew from "../assets/image/bgnew.png"
import bgdark from "../assets/image/dark.png"
 

import IdleTimer from 'react-idle-timer'
import { keyboard } from "@testing-library/user-event/dist/keyboard";


interface IProp {}

  interface IState {
    customKeyboardLayout: string[][];
    layoutName: string;

    disableLeft: boolean;
    disableRight: boolean;

    steps: number;
    background: string;

    seconds: number;
    photoNumber: number;
    webcamPhotos: string[];

    selectedCanvas: string;
    emailInput: string;

    flash: boolean;
    startPictureTaking: boolean;
  }

  export default class PhotoComponent extends React.Component<IProp, IState> {
    private readonly canvasWebcamRef: React.RefObject<HTMLCanvasElement>;

    private readonly photoDivRef: React.RefObject<HTMLDivElement>;
    private readonly photoCarouselRef: React.RefObject<HTMLDivElement>;

    private readonly canvasDiv1Ref: React.RefObject<HTMLDivElement>;
    private readonly canvasDiv2Ref: React.RefObject<HTMLDivElement>;
    private readonly canvasDiv3Ref: React.RefObject<HTMLDivElement>;

    private readonly formRef: React.RefObject<HTMLFormElement>;

    private readonly bgChoicesPolos: string[];

    constructor(props: IProp) {
      super(props);
      this.state = {
        customKeyboardLayout: [
          ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
          ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
          ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
          ["↑", "z", "x", "c", "v", "b", "n", "m", ".", "←"],
          ["-", "_", "@", ".com", "@gmail.com"],
        ],
        layoutName: "default",

        disableLeft: true,
        disableRight: false,

        steps: 1,
        // steps: 4,
        background: bgbaru,

        seconds: 3,
        photoNumber: 0,
        webcamPhotos: [],

        selectedCanvas: "",
        emailInput: "",

        flash: false,
        startPictureTaking: false,
      };
      this.canvasWebcamRef = React.createRef<HTMLCanvasElement>();

      this.photoDivRef = React.createRef<HTMLDivElement>();
      this.photoCarouselRef = React.createRef<HTMLDivElement>();

      this.canvasDiv1Ref = React.createRef<HTMLDivElement>();
      this.canvasDiv2Ref = React.createRef<HTMLDivElement>();
      this.canvasDiv3Ref = React.createRef<HTMLDivElement>();

      this.formRef = React.createRef<HTMLFormElement>();

      this.bgChoicesPolos = [bgbaru, bgstar, bgnew, bgdark];
    }

    //email
    componentDidMount() {
      emailjs.init("oE5mnt-IvEJlg0wCc");
    }

    //muncul camera
    private chromaKey() {
      const video = document.querySelector("#video") as HTMLVideoElement;
      const canvas: HTMLCanvasElement | null = document.querySelector("#canvas");
      if (canvas) {
        const ctx = canvas.getContext("2d");

        
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          /*

            // let difference =
            //   this.calculateDistance(red, 50, 100) +
            //   this.calculateDistance(green, 148, 190) +
            //   this.calculateDistance(blue, 100, 137);
            // difference /= 255 * 3; // convert to percent
            // if (difference < 0.05) imageData.data[offset + 3] = 0;
          }
         ;*/ ctx.putImageData(imageData, 0, 0);
        }
      }
    }
  

    // private calculateDistance(c: number, min: number, max: number) {
    //   if (c < min) return min - c;
    //   if (c > max) return c - max;

    //   return 0;
    // }

    private handleOnIdle() {
      window.location.assign("/");
    }


    //function tambahan
    private async goLeft() {
      const leftStep: number = this.state.steps - 1;
      await this.setState({ steps: leftStep });

      this.checkSteps(leftStep);
    }

    private async goRight() {
      const rightStep: number = this.state.steps + 1;
      await this.setState({ steps: rightStep });

      this.checkSteps(rightStep);
    }

    private async checkPhotoBeforeGoRight() {
      if (!this.state.selectedCanvas) {
        await this.selectPhoto(0);
      }

      this.goRight();
    }

    private async checkSteps(step: number) {
      if (step === 1) {
        this.setState({ disableLeft: true });
      } else {
        this.setState({ disableLeft: false });
      }

      if (step === 2) {
        await this.setState({
          photoNumber: 0,
          seconds: 3,
          webcamPhotos: [],
          startPictureTaking: false,
          flash: false,
        });
        this.startWebcam();
      }

      if (step === 3) {
        await this.state.webcamPhotos.forEach((data, index) => {
          setTimeout(() => {
          this.mountCanvas(data, index);
          }, 1000);
        });
      }
    }


    //function utama
    private selectBackground(index: number) {
      this.setState({ background: this.bgChoicesPolos[index] });
    }

    keyboardClick(button: string) {
      let input: string;

      if (button === "↑") {
        this.handleShift();
      } else if (button === "←") {
        input = this.state.emailInput.slice(0, -1);
        this.setState({ emailInput: input });
      } else {
        // {this.state.layoutName === 'default' ? key : key.includes(".com") ? key : key.toUpperCase()}

        if (this.state.layoutName === "default") {
          input = this.state.emailInput + button;
          this.setState({ emailInput: input });
        } else {
          if (button.includes(".com")) {
            input = this.state.emailInput + button;
            this.setState({ emailInput: input });
          } else {
            input = this.state.emailInput + button.toUpperCase();
            this.setState({ emailInput: input });
          }
        }
      }
    }

    private handleShift() {
      const layoutName = this.state.layoutName;

      this.setState({
        layoutName: layoutName === "default" ? "shift" : "default",
      });
    }

    private startWebcam() {
      const video = document.querySelector("#video") as HTMLVideoElement;
      const canvas = document.querySelector("#canvas") as HTMLCanvasElement;

      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          video.srcObject = stream;
        });

      video.addEventListener("loadeddata", () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        setInterval(() => {
          this.chromaKey();
        }, 0);
      });
    }

    private startTimer() {
      this.setState({ flash: false, startPictureTaking: true });
      if (this.state.seconds > 0) {
        setTimeout(() => {
          this.setState({ seconds: this.state.seconds - 1 });
          if (this.state.seconds > 0) {
            this.startTimer();
          } else {
            this.getWebcam();
          }
        }, 1500);
      }
    }

    private getWebcam() {
    const cameraPhoto = this.canvasWebcamRef.current?.toDataURL();
    const webcams = this.state.webcamPhotos;
    webcams[this.state.photoNumber] = cameraPhoto as string;
    this.setState({ flash: false, startPictureTaking: true });
    this.setState({
      webcamPhotos: webcams,
      photoNumber: this.state.photoNumber + 1,
      // seconds: 3,
      flash: true,
    });
    // if (this.state.photoNumber < 1) {
    //   setTimeout(() => {
    //     this.setState({ flash: true });
    //   }, 1000);
    //   setTimeout(() => {
    //     this.setState({ seconds: 3 });
    //     this.startTimer();
    //   }, 3000);
    // }
    this.goRight();
  }

 //canvas
      private async mountCanvas(data: string, index: number) {
      const cameraImg = new window.Image();
      cameraImg.src = data;

      const resizedCanvas = document.createElement("canvas");
      const resizedContext = resizedCanvas.getContext("2d");

      resizedCanvas.height = 1080;
      resizedCanvas.width = 1920;

      const background = this.state.background;
      const canvasBg = new window.Image();
      canvasBg.onload = function () {
        resizedContext?.drawImage(canvasBg, 400, 60, 1080, 980)
        resizedContext?.drawImage(cameraImg, 685, 240, 520, 620);
        console.log('draw')
      };
      canvasBg.src = background;

      let divRef: React.RefObject<HTMLDivElement>;

        divRef = this.canvasDiv1Ref;
        if (divRef.current?.hasChildNodes()) {
          divRef.current?.removeChild(divRef.current.children[0]);
        }
        console.log(divRef, canvasBg, "append");
        divRef.current?.appendChild(resizedCanvas);
      }

    private async selectPhoto(index: number) {
      let data64: string;
        const divRef: HTMLDivElement = this.canvasDiv1Ref
          .current as HTMLDivElement;
        const canvas: HTMLCanvasElement = divRef
          .childNodes[0] as HTMLCanvasElement;

        data64 = await canvas.toDataURL("image/jpeg");
        console.log(data64);
        this.setState({ selectedCanvas: data64 });
     
    }

    //email
    private sendEmail() {
      this.setState({ disableLeft: true, disableRight: true });

      const serviceID = "gmail";
      const templateID = "gmail";

      emailjs.send(serviceID, templateID, {
        to_email: this.state.emailInput,
        //booth_photo: this.state.selectedCanvas
      }).then(function() {
        console.log('SUCCESS!');
        }, function(error) {
        console.log('FAILED...', error);
        });
      
      this.goRight();
/*
      emailjs
        .send(serviceID, templateID, {
          to_email: this.state.emailInput,
          booth_photo: this.state.selectedCanvas,
        })
        .then(
          () => {
            const db = getDatabase();
            const postListRef = ref(
              db,
              `/${new Date().toLocaleDateString("id-ID").split("/").join("")}`
            );
            const newPostRef = push(postListRef);
            set(newPostRef, {
              rtDate: new Date().toLocaleDateString("id-ID"),
              rtTime: new Date().toLocaleTimeString("id-ID"),
              userEmail: this.state.emailInput,
            });
          },
          (err) => {
            const db = getDatabase();
            const postListRef = ref(db, "/notsent");
            const newPostRef = push(postListRef);
            set(newPostRef, {
              rtDate: new Date().toLocaleDateString("id-ID"),
              rtTime: new Date().toLocaleTimeString("id-ID"),
              userEmail: this.state.emailInput,
            });
          }
        );

      this.goRight();
    }
  */}

  //tampilan
render(): React.ReactNode {
    const backgroundCarouselContents: JSX.Element[] = [];

    this.bgChoicesPolos.forEach((data, index) => {
      backgroundCarouselContents.push(
        <div key={index} className={Style.carousel_container}>
          <img alt={`background${index}`} src={data} />
        </div>
      );
    });

   return (
      <>
        {this.state.steps === 1 ? (
          <>
            <div className={Style.background_selections}>
              <div className={Style.step_title}>
                <label>SELECT BACKGROUND</label>
              </div>
              <div className={Style.background_choices_row}>
                <Carousel
                  className={Style.carousel}
                  centerMode
                  swipeable
                  showArrows={false}
                  emulateTouch={true}
                  showThumbs={false}
                  onChange={(index: number) => this.selectBackground(index)}
                  onClickItem={(index: number) => this.selectBackground(index)}
                >
                  {backgroundCarouselContents}
                </Carousel>
              </div>
            </div>
            <div className={Style.navigation_container}>
              <div className={Style.navigation_buttons}>
                <button
                  disabled={this.state.disableLeft}
                  onClick={() => this.goLeft()}
                >
                  <MdChevronLeft /> BACK
                </button>
                <button
                  disabled={this.state.disableRight}
                  onClick={() => this.goRight()}
                >
                  NEXT <MdChevronRight />
                </button>
              </div>
            </div>
          </>
        ) : this.state.steps === 2 ? (
          <>
            <div className={`flash ${this.state.flash}`} />

            {!this.state.flash &&
            this.state.startPictureTaking &&
            this.state.seconds > 0 &&
            this.state.seconds <= 3 ? (
              <div className={Style.timer_container}>
                <label>{this.state.seconds}</label>
              </div>
            ) : (
              <></>
            )}

            {!this.state.startPictureTaking ? (
              <div
                className={Style.floating_button}
                onClick={this.startTimer.bind(this)}
              >
                <img alt="take pic" src={takepic} />
              </div>
            ) : (
              <></>
            )}

            <div ref={this.photoDivRef} className={Style.photo_take_div}>
              <div className={Style.selected_background_container}>
                <img
                  alt="background"
                  src={this.state.background}
                  className={Style.selected_pose_image}
                />
              </div>
              <div className={Style.camera_view}>
                  <video width="10" height="20" src="" id="video" autoPlay />
                  <canvas
                    id="canvas"
                    width="0"
                    height="0"
                    ref={this.canvasWebcamRef}
                  />
                </div>
            </div>
          </>
        ) : this.state.steps === 3 ? (
          <>
          <div className={Style.picture_selections}>
            <div className={Style.step_title}>
              <label>CHECK YOUR PICTURE</label>
            </div>
            <div ref={this.canvasDiv1Ref} className={Style.canvas_container}>
              {/* <div
                ref={this.canvasDiv1Ref}
                className={Style.canvas_container}
                /> */}
           </div>
          </div>

            <div className={Style.navigation_container}>
              <div className={Style.navigation_buttons}>
                <button
                  disabled={this.state.disableLeft}
                  onClick={() => this.goLeft()}
                >
                  <MdChevronLeft /> BACK
                </button>
                <button
                  disabled={this.state.disableRight}
                  onClick={() => this.checkPhotoBeforeGoRight()}
                >
                  NEXT <MdChevronRight />
                </button>
              </div>
            </div>
          </>
        ) : this.state.steps === 4 ? (
         <>
            <div className={Style.final_step_container}>
              <div className={Style.step_title}>
                <label>WRITE YOUR EMAIL ON THE FORM</label>
              </div>
                  <form ref={this.formRef}>
                    <div className={Style.input}>
                      <input
                      placeholder="enter your email"
                      readOnly
                      type="text"
                      name="to_email"
                      id="to_email"
                      value={this.state.emailInput}
                    />
                    </div>
                  </form>
                  <div className={Style.new_keyboard}>
                    {this.state.customKeyboardLayout.map((data, index) => {
                      return (
                        <div className={Style.new_keyboard_row}>
                          {data.map((key, index) => {
                            return (
                              <div
                                className={Style.new_keyboard}
                                onClick={() => this.keyboardClick(key)}
                              >
                                <button data-skbtn={key} key={index}>
                                  {this.state.layoutName === "default"
                                    ? key
                                    : key.includes(".com")
                                    ? key
                                    : key.toUpperCase()}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                </div>
            </div>
            <div className={Style.navigation_container}>
              <div className={Style.navigation_buttons}>
                <button
                  disabled={this.state.disableLeft}
                  onClick={() => this.goLeft()}
                >
                  <MdChevronLeft /> BACK
                </button>
                <button
                  disabled={this.state.disableRight}
                  onClick={() => this.sendEmail()}
                >
                  FINISH <MdChevronRight />
                </button>
              </div>
            </div>
          </>
        ) : this.state.steps === 5 ? (
          <>
            <Navigate replace to="/thanks" />
          </>
        ) : (
          <></>
        )}
      </>
    );
  }
}