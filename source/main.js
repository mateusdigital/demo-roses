//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : main.js                                                       //
//  Project   : Roses                                                         //
//  Date      : 22-03-16                                                      //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2022                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
__SOURCES = [
    "/modules/demolib/modules/external/chroma.js",
    "/modules/demolib/modules/external/dat.gui.js",
    "/modules/demolib/modules/external/perlin.js",
    "/modules/demolib/modules/external/Stats.js",

    "/modules/demolib/source/tween.js",
    "/modules/demolib/source/demolib.js",
];

//------------------------------------------------------------------------------
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
            //
            // Create Canvas
            //

            canvas = document.createElement("canvas");

            canvas.width            = window.innerWidth;
            canvas.height           = window.innerHeight;
            canvas.style.position   = "fixed";
            canvas.style.left       = "0px";
            canvas.style.top        = "0px";
            canvas.style.zIndex     = "-100";

            document.body.appendChild(canvas);


            //
            // Create Stats
            //

            G.stats = new Stats();
            G.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(G.stats.dom);

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

    set_canvas_line_width(1);
    set_canvas_fill("black");

    translate_canvas_to_center();
    clear_canvas();

    //
    // Constants
    //

    C.EASINGS = [
        Tween.Easing.Elastic.InOut,
        Tween.Easing.Back   .InOut,
        Tween.Easing.Bounce .InOut,
    ];

    C.ROSE_DURATION = make_min_max(2, 2);
    C.TARGET_VALUE  = make_min_max( 1,  8);
    C.ANGLE_INCR    = 0.001;

    //
    // Globals
    //

    G.n           = 3;
    G.d           = 2;
    G.curr_color  = get_random_color();
    G.clear_color = chroma("black");

    G.effects = [
        create_random_rose,
    ]

    create_random_rose();
    start_draw_loop(update_demo);
}

//------------------------------------------------------------------------------
function update_demo(dt)
{
    if(G.stats) {
        G.stats.begin();
    }

    const ratio = G.tween.get_ratio();
    const alpha = map(ratio, 0, 1, 0.01, 0.8);
    clear_canvas(G.clear_color.alpha(1));

    G.tween.update(dt);
    get_context().rotate(dt / 10);

    if(G.stats) {
        G.stats.end();
    }
}

//------------------------------------------------------------------------------
function get_random_color()
{
    const hue = random_int(0, 360);
    return chroma.hsl(hue, 1, 0.5);
}

//------------------------------------------------------------------------------
function create_random_rose()
{
    const duration       = C.ROSE_DURATION.random_float();
    const is_animating_n = random_bool();

    const value_start  = (is_animating_n) ? G.n : G.d;
    const value_target = C.TARGET_VALUE.random_int();

    const canvas_w   = get_canvas_width ();
    const canvas_h   = get_canvas_height();
    const shape_size = (Math.min(canvas_w, canvas_h) * 0.8 / 2);

    const next_color = get_random_color();
    const easing     = random_element(C.EASINGS);

    // echo(value_start, value_target, is_animating_n, G.n, G.d);

    const ctx = get_context();
    G.tween = Tween.create(duration)
        .from({v: value_start })
        .to  ({v: value_target})
        .easing(easing)
        .on_complete(()=> {
            G.curr_color = next_color;

            if(is_animating_n) {
                G.n = value_target;
            } else {
                G.d = value_target;
            }

            const next_effect = random_element(G.effects);
            next_effect();
        })
        .on_update((dt, v)=> {
            const n = (is_animating_n) ? v.v : G.n;
            const d = (is_animating_n) ? G.d : v.v;
            const k = (n / d);

            const max_angle = (MATH_2PI / k) * Math.max(n, d);

            const color     = chroma.mix(G.curr_color, next_color, G.tween.get_ratio());
            const thickness = map(Math.sin(G.tween.get_ratio() * MATH_2PI), -1, +1, 2, 10);
            echo(n, d, k, max_angle / MATH_2PI);
            begin_draw();

            ctx.beginPath();
            for(let theta = 0; theta < max_angle; theta += C.ANGLE_INCR) {
                const x = shape_size * Math.cos(k * theta) * Math.cos(theta);
                const y = shape_size * Math.cos(k * theta) * Math.sin(theta);

                if(theta == 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            set_canvas_stroke    (color);
            set_canvas_line_width(thickness);

            ctx.stroke();
            end_draw();
        })
        .start();
}
