import { GameActor } from './engine.core'

export {}

declare global {
    function NAME(name: string): void
    function AUTHOR(name: string): void
    function DEBUG(): void
    function SIZE(width: number, height: number): void
    function RENDER(mode: '2d' | '3d'): void
    function FONTSIZE(size: number): void
    function BGCOLOR(hexString: string): void
    function NOINTRO(): void
    function STARTROOM(room: string): void
    function ACTOR(name: string, def: any): void
    function ASSET(url: string): string
    function SPRITE(name: string, imageName: string, sx: number, sy: number, width: number, height: number): void
    function IMAGE(name: string, fileName: string): void
    function ANIMATION(
        name: string,
        imageName: string,
        duration: number,
        frameData:
            | number[]
            | {
                  x: number
                  y: number
                  width: number
                  height: number
                  duration: number
              }
    ): void
    function SOUND(name: string, fileName: string, options?: { volume?: number }): void
    function ROOM(name: string, initFn: () => void): void
    // Within ROOMs
    function BACKGROUND(name: string): void
    function ACTOR(
        name: string,
        def: {
            x: number
            y: number
            image: string
            visible?: boolean
            rotation?: number
            scale?: number
            rotateSpeed?: number
            gravity?: number
            friction?: number
            xSpeed?: number
            ySpeed?: number
            alpha?: number
            mousepointer?: string
        }
    ): void
    function HOTSPOT(name: string, x: number, y: number, width: number, height: number): void
    function ONCE(actionFn: () => void): void
    function CLICK(actorOrHotspotName: string, actionFn: () => void): void
    // Actions
    function GOTO(roomName: string): void
    function PLAYSOUND(name: string, options?: { loop?: boolean; volume?: number }): void
    function STOPSOUND(name: string): void
    function SHOWTEXT(text: string): void
    function HIDETEXT(): void
    function SHOWACTOR(name: string): void
    function HIDEACTOR(name: string): void
    function TOGGLEACTOR(name: string): void
    function MOVEACTOR(
        name: string,
        x: number,
        y: number,
        duration: number,
        wait?: boolean,
        options?: { easing?: string }
    ): void
    function GETACTOR(name: string, callback: (actor: GameActor) => void): void
    function WAIT(ms: number): void
    const P5: any
}
