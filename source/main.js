//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : main.js                                                       //
//  Project   : //
//  Date      : //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2022                                                  // 
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
__SOURCES = [
    "/modules/demolib/modules/external/chroma.js",
    "/modules/demolib/modules/external/dat.gui.js",
    "/modules/demolib/modules/external/perlin.js",
    "/modules/demolib/source/demolib.js",
]

const C = {}; // Constants
const G = {}; // Globals


//----------------------------------------------------------------------------//
// demolib boilerplate                                                        //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function setup_demo_mode()
{
    return new Promise((resolve, reject)=> {
        demolib_load_all_scripts(__SOURCES).then(()=> {
            canvas = document.createElement("canvas");

            canvas.width            = window.innerWidth;
            canvas.height           = window.innerHeight;
            canvas.style.position   = "fixed";
            canvas.style.left       = "0px";
            canvas.style.top        = "0px";
            canvas.style.zIndex     = "-100";

            document.body.appendChild(canvas);
            resolve(canvas);
        });
    });
}

//------------------------------------------------------------------------------
function demo_start(user_canvas)
{
    if(!user_canvas) {
        setup_demo_mode().then((_created_canvas)=>{
            setup_common(_created_canvas);
        });
    } else {
        setup_common(user_canvas);
    }
}


//------------------------------------------------------------------------------
function setup_common(canvas)
{
    set_random_seed(null);
    set_noise_seed (null);

    set_main_canvas       (canvas);
    install_input_handlers(canvas);
    
    G.a = 100;
    G.n = 5;
    G.d = 3;
    G.points_count = 100;

    translate_canvas_to_center();
    
    const gui = new dat.GUI();
    gui.add(G, "points_count", 100, 1000)
    gui.add(G, "n", 1, 20)
    gui.add(G, "d", 1, 20)


    start_draw_loop(update_demo);
}

//------------------------------------------------------------------------------
function update_demo(dt)
{
    begin_draw();

    set_canvas_fill("black");
    clear_canvas();

    const canvas_w = get_canvas_width ();
    const canvas_h = get_canvas_height(); 
    const min_side = Math.min(canvas_w, canvas_h) / 2;

    const sine = Math.sin(get_total_time());

    const a = map(sine, -1, +1, min_side * 0.5, min_side * 0.9);
    const n = map(sine, -1, +1, 1, 10);
    const d = G.d; 
    const k = (n / d);

    const ctx = get_context();

    set_canvas_fill  ("white");
    set_canvas_stroke("white");
    ctx.beginPath();

    for(let i = 0; i < MATH_2PI * d; i += 0.001) { 
        const theta = i;
        const x = a * Math.cos(k * theta) * Math.cos(theta);
        const y = a * Math.cos(k * theta) * Math.sin(theta);
        if(i == 0) { 
            ctx.moveTo(x, y);
        } else { 
            ctx.lineTo(x, y);
        }
    }
    // ctx.closePath();
    ctx.stroke();

    end_draw()
}
