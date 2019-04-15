This is build using .NET core 3.0.0 preview so may have trouble if you don't have the preview bits.
I don't think there is anything within that is really core 3.0 though so this could be downgraded to 2.2.
if using VS the typescript build system should write the file plp.js to wwwroot/js. If not you will need to compile it with tsc and maybe move it there.