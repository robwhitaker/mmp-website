var Elm = Elm || { Native: {} };
Elm.Animation = Elm.Animation || {};
Elm.Animation.make = function (_elm) {
   "use strict";
   _elm.Animation = _elm.Animation || {};
   if (_elm.Animation.values)
   return _elm.Animation.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Animation",
   $Basics = Elm.Basics.make(_elm),
   $Easing = Elm.Easing.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $Time = Elm.Time.make(_elm);
   var isScheduled = F2(function (t,
   _v0) {
      return function () {
         switch (_v0.ctor)
         {case "A": return _U.cmp(t,
              _v0._0.start + _v0._0.delay) < 1;}
         _U.badCase($moduleName,
         "on line 292, column 5 to 21");
      }();
   });
   var getTo = function (_v3) {
      return function () {
         switch (_v3.ctor)
         {case "A": return _v3._0.to;}
         _U.badCase($moduleName,
         "on line 261, column 15 to 19");
      }();
   };
   var getFrom = function (_v6) {
      return function () {
         switch (_v6.ctor)
         {case "A": return _v6._0.from;}
         _U.badCase($moduleName,
         "on line 256, column 17 to 23");
      }();
   };
   var getEase = function (_v9) {
      return function () {
         switch (_v9.ctor)
         {case "A": return _v9._0.ease;}
         _U.badCase($moduleName,
         "on line 251, column 17 to 23");
      }();
   };
   var getDelay = function (_v12) {
      return function () {
         switch (_v12.ctor)
         {case "A":
            return _v12._0.delay;}
         _U.badCase($moduleName,
         "on line 246, column 18 to 25");
      }();
   };
   var getStart = function (_v15) {
      return function () {
         switch (_v15.ctor)
         {case "A":
            return _v15._0.start;}
         _U.badCase($moduleName,
         "on line 231, column 18 to 25");
      }();
   };
   var timeElapsed = F2(function (t,
   _v18) {
      return function () {
         switch (_v18.ctor)
         {case "A":
            return $Basics.max(0)(t - (_v18._0.start + _v18._0.delay));}
         _U.badCase($moduleName,
         "on line 208, column 5 to 33");
      }();
   });
   var spd = F3(function (dos,
   from,
   to) {
      return function () {
         switch (dos.ctor)
         {case "Duration":
            return $Basics.abs(to - from) / dos._0;
            case "Speed": return dos._0;}
         _U.badCase($moduleName,
         "between lines 101 and 103");
      }();
   });
   var getSpeed = function (_v24) {
      return function () {
         switch (_v24.ctor)
         {case "A": return A3(spd,
              _v24._0.dos,
              _v24._0.from,
              _v24._0.to);}
         _U.badCase($moduleName,
         "on line 241, column 32 to 47");
      }();
   };
   var dur = F3(function (dos,
   from,
   to) {
      return function () {
         switch (dos.ctor)
         {case "Duration": return dos._0;
            case "Speed":
            return $Basics.abs(to - from) / dos._0;}
         _U.badCase($moduleName,
         "between lines 94 and 96");
      }();
   });
   var animate = F2(function (t,
   _v30) {
      return function () {
         switch (_v30.ctor)
         {case "A": return function () {
                 var duration = A3(dur,
                 _v30._0.dos,
                 _v30._0.from,
                 _v30._0.to);
                 var fr = A2($Basics.clamp,
                 0,
                 1)((t - _v30._0.start - _v30._0.delay) / duration);
                 var eased = _v30._0.ease(fr);
                 var correction = function () {
                    var _v33 = _v30._0.ramp;
                    switch (_v33.ctor)
                    {case "Just":
                       return function () {
                            var from$ = _v33._0 * (t - _v30._0.start);
                            var eased$ = $Easing.easeInOutSine(fr);
                            return from$ - from$ * eased$;
                         }();
                       case "Nothing": return 0;}
                    _U.badCase($moduleName,
                    "between lines 127 and 132");
                 }();
                 return _v30._0.from + (_v30._0.to - _v30._0.from) * eased + correction;
              }();}
         _U.badCase($moduleName,
         "between lines 124 and 132");
      }();
   });
   var velocity = F2(function (t,
   u) {
      return function () {
         var forwDiff = A2(animate,
         t + 10,
         u);
         var backDiff = A2(animate,
         t - 10,
         u);
         return (forwDiff - backDiff) / 20;
      }();
   });
   var timeRemaining = F2(function (t,
   _v35) {
      return function () {
         switch (_v35.ctor)
         {case "A": return function () {
                 var duration = A3(dur,
                 _v35._0.dos,
                 _v35._0.from,
                 _v35._0.to);
                 return $Basics.max(0)(_v35._0.start + _v35._0.delay + duration - t);
              }();}
         _U.badCase($moduleName,
         "between lines 215 and 216");
      }();
   });
   var getDuration = function (_v38) {
      return function () {
         switch (_v38.ctor)
         {case "A": return A3(dur,
              _v38._0.dos,
              _v38._0.from,
              _v38._0.to);}
         _U.badCase($moduleName,
         "on line 236, column 35 to 50");
      }();
   };
   var equals = F2(function (_v41,
   _v42) {
      return function () {
         switch (_v42.ctor)
         {case "A": return function () {
                 switch (_v41.ctor)
                 {case "A":
                    return _U.eq(_v41._0.start + _v41._0.delay,
                      _v42._0.start + _v42._0.delay) && (_U.eq(_v41._0.from,
                      _v42._0.from) && (_U.eq(_v41._0.to,
                      _v42._0.to) && (_U.eq(_v41._0.ramp,
                      _v42._0.ramp) && ((_U.eq(_v41._0.dos,
                      _v42._0.dos) || _U.cmp(1.0e-3,
                      $Basics.abs(A3(dur,
                      _v41._0.dos,
                      _v41._0.from,
                      _v41._0.to) - A3(dur,
                      _v42._0.dos,
                      _v42._0.from,
                      _v42._0.to))) > -1) && A2($List.all,
                      function (t) {
                         return _U.eq(_v41._0.ease(t),
                         _v42._0.ease(t));
                      },
                      _L.fromArray([0.1
                                   ,0.3
                                   ,0.7
                                   ,0.9]))))));}
                 _U.badCase($moduleName,
                 "between lines 280 and 285");
              }();}
         _U.badCase($moduleName,
         "between lines 280 and 285");
      }();
   });
   var isRunning = F2(function (t,
   _v47) {
      return function () {
         switch (_v47.ctor)
         {case "A": return function () {
                 var duration = A3(dur,
                 _v47._0.dos,
                 _v47._0.from,
                 _v47._0.to);
                 return _U.cmp(t,
                 _v47._0.start + _v47._0.delay) > 0 && _U.cmp(t,
                 _v47._0.start + _v47._0.delay + duration) < 0;
              }();}
         _U.badCase($moduleName,
         "between lines 298 and 299");
      }();
   });
   var isDone = F2(function (t,
   _v50) {
      return function () {
         switch (_v50.ctor)
         {case "A": return function () {
                 var duration = A3(dur,
                 _v50._0.dos,
                 _v50._0.from,
                 _v50._0.to);
                 return _U.cmp(t,
                 _v50._0.start + _v50._0.delay + duration) > -1;
              }();}
         _U.badCase($moduleName,
         "between lines 305 and 306");
      }();
   });
   var A = function (a) {
      return {ctor: "A",_0: a};
   };
   var undo = F2(function (t,
   _v53) {
      return function () {
         switch (_v53.ctor)
         {case "A":
            return A(_U.replace([["from"
                                 ,_v53._0.to]
                                ,["to",_v53._0.from]
                                ,["start",t]
                                ,["delay"
                                 ,0 - A2(timeRemaining,t,_v53)]
                                ,["ramp",$Maybe.Nothing]
                                ,["ease"
                                 ,function (t) {
                                    return 1 - _v53._0.ease(1 - t);
                                 }]],
              _v53._0));}
         _U.badCase($moduleName,
         "between lines 142 and 143");
      }();
   });
   var delay = F2(function (x,
   _v56) {
      return function () {
         switch (_v56.ctor)
         {case "A":
            return A(_U.replace([["delay"
                                 ,x]],
              _v56._0));}
         _U.badCase($moduleName,
         "on line 183, column 17 to 34");
      }();
   });
   var ease = F2(function (x,
   _v59) {
      return function () {
         switch (_v59.ctor)
         {case "A":
            return A(_U.replace([["ease"
                                 ,x]],
              _v59._0));}
         _U.badCase($moduleName,
         "on line 189, column 16 to 32");
      }();
   });
   var from = F2(function (x,
   _v62) {
      return function () {
         switch (_v62.ctor)
         {case "A":
            return A(_U.replace([["from",x]
                                ,["ramp",$Maybe.Nothing]],
              _v62._0));}
         _U.badCase($moduleName,
         "on line 194, column 16 to 49");
      }();
   });
   var to = F2(function (x,_v65) {
      return function () {
         switch (_v65.ctor)
         {case "A":
            return A(_U.replace([["to",x]
                                ,["ramp",$Maybe.Nothing]],
              _v65._0));}
         _U.badCase($moduleName,
         "on line 201, column 14 to 45");
      }();
   });
   var AnimRecord = F7(function (a,
   b,
   c,
   d,
   e,
   f,
   g) {
      return {_: {}
             ,delay: b
             ,dos: c
             ,ease: e
             ,from: f
             ,ramp: d
             ,start: a
             ,to: g};
   });
   var Speed = function (a) {
      return {ctor: "Speed",_0: a};
   };
   var speed = F2(function (x,
   _v68) {
      return function () {
         switch (_v68.ctor)
         {case "A":
            return A(_U.replace([["dos"
                                 ,Speed($Basics.abs(x))]],
              _v68._0));}
         _U.badCase($moduleName,
         "on line 177, column 17 to 44");
      }();
   });
   var Duration = function (a) {
      return {ctor: "Duration"
             ,_0: a};
   };
   var defaultDuration = Duration(750 * $Time.millisecond);
   var animation = function (now) {
      return A(A7(AnimRecord,
      now,
      0,
      defaultDuration,
      $Maybe.Nothing,
      $Easing.easeInOutSine,
      0,
      1));
   };
   var retarget = F3(function (t,
   newTo,
   _v71) {
      return function () {
         switch (_v71.ctor)
         {case "A": return _U.eq(newTo,
              _v71._0.to) ? _v71 : A2(isScheduled,
              t,
              _v71) ? A(_U.replace([["to"
                                    ,newTo]
                                   ,["ramp",$Maybe.Nothing]],
              _v71._0)) : A2(isDone,
              t,
              _v71) ? A(_U.replace([["start"
                                    ,t]
                                   ,["from",_v71._0.to]
                                   ,["to",newTo]
                                   ,["delay",0]
                                   ,["ramp",$Maybe.Nothing]],
              _v71._0)) : _U.eq(_v71._0.from,
              _v71._0.to) ? A(_U.replace([["start"
                                          ,t]
                                         ,["to",newTo]
                                         ,["dos",defaultDuration]
                                         ,["ramp",$Maybe.Nothing]],
              _v71._0)) : function () {
                 var pos = A2(animate,t,_v71);
                 var vel = A2(velocity,t,_v71);
                 return A(A7(AnimRecord,
                 t,
                 0,
                 Speed(vel / 3),
                 $Maybe.Just(vel),
                 _v71._0.ease,
                 pos,
                 newTo));
              }();}
         _U.badCase($moduleName,
         "between lines 156 and 163");
      }();
   });
   var $static = function (x) {
      return A(A7(AnimRecord,
      0,
      0,
      Duration(0),
      $Maybe.Nothing,
      $Easing.easeInOutSine,
      x,
      x));
   };
   var duration = F2(function (x,
   _v74) {
      return function () {
         switch (_v74.ctor)
         {case "A":
            return A(_U.replace([["dos"
                                 ,Duration(x)]],
              _v74._0));}
         _U.badCase($moduleName,
         "on line 169, column 20 to 44");
      }();
   });
   _elm.Animation.values = {_op: _op
                           ,animation: animation
                           ,$static: $static
                           ,animate: animate
                           ,duration: duration
                           ,speed: speed
                           ,delay: delay
                           ,ease: ease
                           ,from: from
                           ,to: to
                           ,undo: undo
                           ,retarget: retarget
                           ,getStart: getStart
                           ,getDuration: getDuration
                           ,getSpeed: getSpeed
                           ,getDelay: getDelay
                           ,getEase: getEase
                           ,getFrom: getFrom
                           ,getTo: getTo
                           ,equals: equals
                           ,velocity: velocity
                           ,timeElapsed: timeElapsed
                           ,timeRemaining: timeRemaining
                           ,isScheduled: isScheduled
                           ,isRunning: isRunning
                           ,isDone: isDone};
   return _elm.Animation.values;
};
Elm.AnimationWrapper = Elm.AnimationWrapper || {};
Elm.AnimationWrapper.make = function (_elm) {
   "use strict";
   _elm.AnimationWrapper = _elm.AnimationWrapper || {};
   if (_elm.AnimationWrapper.values)
   return _elm.AnimationWrapper.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "AnimationWrapper",
   $Animation = Elm.Animation.make(_elm),
   $Basics = Elm.Basics.make(_elm),
   $Effects = Elm.Effects.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $Time = Elm.Time.make(_elm);
   var query = F2(function (queryFn,
   _v0) {
      return function () {
         return A2(queryFn,
         _v0.elapsedTime,
         _v0.animation);
      }();
   });
   var isStopped = function (_) {
      return _.isStopped;
   };
   var isDone = function (_v2) {
      return function () {
         return A2($Animation.isDone,
         _v2.elapsedTime,
         _v2.animation);
      }();
   };
   var value = function (_v4) {
      return function () {
         return A2($Animation.animate,
         _v4.elapsedTime,
         _v4.animation);
      }();
   };
   var Tick = function (a) {
      return {ctor: "Tick",_0: a};
   };
   var Seek = function (a) {
      return {ctor: "Seek",_0: a};
   };
   var Resume = {ctor: "Resume"};
   var Stop = {ctor: "Stop"};
   var Start = function (a) {
      return {ctor: "Start",_0: a};
   };
   var empty = {_: {}
               ,animation: $Animation.$static(0)
               ,elapsedTime: 0
               ,isStopped: true
               ,prevClockTime: $Maybe.Nothing};
   var update = F2(function (action,
   animationWrapper) {
      return function () {
         switch (action.ctor)
         {case "Resume":
            return A2(F2(function (v0,v1) {
                 return {ctor: "_Tuple2"
                        ,_0: v0
                        ,_1: v1};
              }),
              _U.replace([["isStopped"
                          ,false]],
              animationWrapper),
              $Effects.tick(Tick));
            case "Seek":
            return A2(F2(function (v0,v1) {
                 return {ctor: "_Tuple2"
                        ,_0: v0
                        ,_1: v1};
              }),
              _U.replace([["elapsedTime"
                          ,action._0]],
              animationWrapper),
              $Effects.none);
            case "Start":
            return A2(F2(function (v0,v1) {
                 return {ctor: "_Tuple2"
                        ,_0: v0
                        ,_1: v1};
              }),
              _U.replace([["animation"
                          ,action._0]
                         ,["isStopped",false]],
              empty),
              $Effects.tick(Tick));
            case "Stop":
            return A2(F2(function (v0,v1) {
                 return {ctor: "_Tuple2"
                        ,_0: v0
                        ,_1: v1};
              }),
              _U.replace([["prevClockTime"
                          ,$Maybe.Nothing]
                         ,["isStopped",true]],
              animationWrapper),
              $Effects.none);
            case "Tick":
            return isDone(animationWrapper) || isStopped(animationWrapper) ? A2(F2(function (v0,
              v1) {
                 return {ctor: "_Tuple2"
                        ,_0: v0
                        ,_1: v1};
              }),
              _U.replace([["prevClockTime"
                          ,$Maybe.Nothing]],
              animationWrapper),
              $Effects.none) : function () {
                 var _v10 = animationWrapper.prevClockTime;
                 switch (_v10.ctor)
                 {case "Just":
                    return A2(F2(function (v0,v1) {
                         return {ctor: "_Tuple2"
                                ,_0: v0
                                ,_1: v1};
                      }),
                      _U.replace([["prevClockTime"
                                  ,$Maybe.Just(action._0)]
                                 ,["elapsedTime"
                                  ,animationWrapper.elapsedTime + (action._0 - _v10._0)]],
                      animationWrapper),
                      $Effects.tick(Tick));
                    case "Nothing":
                    return A2(F2(function (v0,v1) {
                         return {ctor: "_Tuple2"
                                ,_0: v0
                                ,_1: v1};
                      }),
                      _U.replace([["prevClockTime"
                                  ,$Maybe.Just(action._0)]],
                      animationWrapper),
                      $Effects.tick(Tick));}
                 _U.badCase($moduleName,
                 "between lines 59 and 71");
              }();}
         _U.badCase($moduleName,
         "between lines 31 and 71");
      }();
   });
   var AnimationWrapper = F4(function (a,
   b,
   c,
   d) {
      return {_: {}
             ,animation: c
             ,elapsedTime: b
             ,isStopped: d
             ,prevClockTime: a};
   });
   _elm.AnimationWrapper.values = {_op: _op
                                  ,AnimationWrapper: AnimationWrapper
                                  ,empty: empty
                                  ,Start: Start
                                  ,Stop: Stop
                                  ,Resume: Resume
                                  ,Seek: Seek
                                  ,Tick: Tick
                                  ,update: update
                                  ,value: value
                                  ,isDone: isDone
                                  ,isStopped: isStopped
                                  ,query: query};
   return _elm.AnimationWrapper.values;
};
Elm.Array = Elm.Array || {};
Elm.Array.make = function (_elm) {
   "use strict";
   _elm.Array = _elm.Array || {};
   if (_elm.Array.values)
   return _elm.Array.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Array",
   $Basics = Elm.Basics.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Array = Elm.Native.Array.make(_elm);
   var append = $Native$Array.append;
   var length = $Native$Array.length;
   var isEmpty = function (array) {
      return _U.eq(length(array),
      0);
   };
   var slice = $Native$Array.slice;
   var set = $Native$Array.set;
   var get = F2(function (i,
   array) {
      return _U.cmp(0,
      i) < 1 && _U.cmp(i,
      $Native$Array.length(array)) < 0 ? $Maybe.Just(A2($Native$Array.get,
      i,
      array)) : $Maybe.Nothing;
   });
   var push = $Native$Array.push;
   var empty = $Native$Array.empty;
   var filter = F2(function (isOkay,
   arr) {
      return function () {
         var update = F2(function (x,
         xs) {
            return isOkay(x) ? A2($Native$Array.push,
            x,
            xs) : xs;
         });
         return A3($Native$Array.foldl,
         update,
         $Native$Array.empty,
         arr);
      }();
   });
   var foldr = $Native$Array.foldr;
   var foldl = $Native$Array.foldl;
   var indexedMap = $Native$Array.indexedMap;
   var map = $Native$Array.map;
   var toIndexedList = function (array) {
      return A3($List.map2,
      F2(function (v0,v1) {
         return {ctor: "_Tuple2"
                ,_0: v0
                ,_1: v1};
      }),
      _L.range(0,
      $Native$Array.length(array) - 1),
      $Native$Array.toList(array));
   };
   var toList = $Native$Array.toList;
   var fromList = $Native$Array.fromList;
   var initialize = $Native$Array.initialize;
   var repeat = F2(function (n,e) {
      return A2(initialize,
      n,
      $Basics.always(e));
   });
   var Array = {ctor: "Array"};
   _elm.Array.values = {_op: _op
                       ,empty: empty
                       ,repeat: repeat
                       ,initialize: initialize
                       ,fromList: fromList
                       ,isEmpty: isEmpty
                       ,length: length
                       ,push: push
                       ,append: append
                       ,get: get
                       ,set: set
                       ,slice: slice
                       ,toList: toList
                       ,toIndexedList: toIndexedList
                       ,map: map
                       ,indexedMap: indexedMap
                       ,filter: filter
                       ,foldl: foldl
                       ,foldr: foldr};
   return _elm.Array.values;
};
Elm.Basics = Elm.Basics || {};
Elm.Basics.make = function (_elm) {
   "use strict";
   _elm.Basics = _elm.Basics || {};
   if (_elm.Basics.values)
   return _elm.Basics.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Basics",
   $Native$Basics = Elm.Native.Basics.make(_elm),
   $Native$Show = Elm.Native.Show.make(_elm),
   $Native$Utils = Elm.Native.Utils.make(_elm);
   var uncurry = F2(function (f,
   _v0) {
      return function () {
         switch (_v0.ctor)
         {case "_Tuple2": return A2(f,
              _v0._0,
              _v0._1);}
         _U.badCase($moduleName,
         "on line 595, column 3 to 8");
      }();
   });
   var curry = F3(function (f,
   a,
   b) {
      return f({ctor: "_Tuple2"
               ,_0: a
               ,_1: b});
   });
   var flip = F3(function (f,b,a) {
      return A2(f,a,b);
   });
   var snd = function (_v4) {
      return function () {
         switch (_v4.ctor)
         {case "_Tuple2": return _v4._1;}
         _U.badCase($moduleName,
         "on line 573, column 3 to 4");
      }();
   };
   var fst = function (_v8) {
      return function () {
         switch (_v8.ctor)
         {case "_Tuple2": return _v8._0;}
         _U.badCase($moduleName,
         "on line 567, column 3 to 4");
      }();
   };
   var always = F2(function (a,
   _v12) {
      return function () {
         return a;
      }();
   });
   var identity = function (x) {
      return x;
   };
   _op["<|"] = F2(function (f,x) {
      return f(x);
   });
   _op["|>"] = F2(function (x,f) {
      return f(x);
   });
   _op[">>"] = F3(function (f,
   g,
   x) {
      return g(f(x));
   });
   _op["<<"] = F3(function (g,
   f,
   x) {
      return g(f(x));
   });
   _op["++"] = $Native$Utils.append;
   var toString = $Native$Show.toString;
   var isInfinite = $Native$Basics.isInfinite;
   var isNaN = $Native$Basics.isNaN;
   var toFloat = $Native$Basics.toFloat;
   var ceiling = $Native$Basics.ceiling;
   var floor = $Native$Basics.floor;
   var truncate = $Native$Basics.truncate;
   var round = $Native$Basics.round;
   var otherwise = true;
   var not = $Native$Basics.not;
   var xor = $Native$Basics.xor;
   _op["||"] = $Native$Basics.or;
   _op["&&"] = $Native$Basics.and;
   var max = $Native$Basics.max;
   var min = $Native$Basics.min;
   var GT = {ctor: "GT"};
   var EQ = {ctor: "EQ"};
   var LT = {ctor: "LT"};
   var compare = $Native$Basics.compare;
   _op[">="] = $Native$Basics.ge;
   _op["<="] = $Native$Basics.le;
   _op[">"] = $Native$Basics.gt;
   _op["<"] = $Native$Basics.lt;
   _op["/="] = $Native$Basics.neq;
   _op["=="] = $Native$Basics.eq;
   var e = $Native$Basics.e;
   var pi = $Native$Basics.pi;
   var clamp = $Native$Basics.clamp;
   var logBase = $Native$Basics.logBase;
   var abs = $Native$Basics.abs;
   var negate = $Native$Basics.negate;
   var sqrt = $Native$Basics.sqrt;
   var atan2 = $Native$Basics.atan2;
   var atan = $Native$Basics.atan;
   var asin = $Native$Basics.asin;
   var acos = $Native$Basics.acos;
   var tan = $Native$Basics.tan;
   var sin = $Native$Basics.sin;
   var cos = $Native$Basics.cos;
   _op["^"] = $Native$Basics.exp;
   _op["%"] = $Native$Basics.mod;
   var rem = $Native$Basics.rem;
   _op["//"] = $Native$Basics.div;
   _op["/"] = $Native$Basics.floatDiv;
   _op["*"] = $Native$Basics.mul;
   _op["-"] = $Native$Basics.sub;
   _op["+"] = $Native$Basics.add;
   var toPolar = $Native$Basics.toPolar;
   var fromPolar = $Native$Basics.fromPolar;
   var turns = $Native$Basics.turns;
   var degrees = $Native$Basics.degrees;
   var radians = function (t) {
      return t;
   };
   _elm.Basics.values = {_op: _op
                        ,max: max
                        ,min: min
                        ,compare: compare
                        ,not: not
                        ,xor: xor
                        ,otherwise: otherwise
                        ,rem: rem
                        ,negate: negate
                        ,abs: abs
                        ,sqrt: sqrt
                        ,clamp: clamp
                        ,logBase: logBase
                        ,e: e
                        ,pi: pi
                        ,cos: cos
                        ,sin: sin
                        ,tan: tan
                        ,acos: acos
                        ,asin: asin
                        ,atan: atan
                        ,atan2: atan2
                        ,round: round
                        ,floor: floor
                        ,ceiling: ceiling
                        ,truncate: truncate
                        ,toFloat: toFloat
                        ,degrees: degrees
                        ,radians: radians
                        ,turns: turns
                        ,toPolar: toPolar
                        ,fromPolar: fromPolar
                        ,isNaN: isNaN
                        ,isInfinite: isInfinite
                        ,toString: toString
                        ,fst: fst
                        ,snd: snd
                        ,identity: identity
                        ,always: always
                        ,flip: flip
                        ,curry: curry
                        ,uncurry: uncurry
                        ,LT: LT
                        ,EQ: EQ
                        ,GT: GT};
   return _elm.Basics.values;
};
Elm.Char = Elm.Char || {};
Elm.Char.make = function (_elm) {
   "use strict";
   _elm.Char = _elm.Char || {};
   if (_elm.Char.values)
   return _elm.Char.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Char",
   $Basics = Elm.Basics.make(_elm),
   $Native$Char = Elm.Native.Char.make(_elm);
   var fromCode = $Native$Char.fromCode;
   var toCode = $Native$Char.toCode;
   var toLocaleLower = $Native$Char.toLocaleLower;
   var toLocaleUpper = $Native$Char.toLocaleUpper;
   var toLower = $Native$Char.toLower;
   var toUpper = $Native$Char.toUpper;
   var isBetween = F3(function (low,
   high,
   $char) {
      return function () {
         var code = toCode($char);
         return _U.cmp(code,
         toCode(low)) > -1 && _U.cmp(code,
         toCode(high)) < 1;
      }();
   });
   var isUpper = A2(isBetween,
   _U.chr("A"),
   _U.chr("Z"));
   var isLower = A2(isBetween,
   _U.chr("a"),
   _U.chr("z"));
   var isDigit = A2(isBetween,
   _U.chr("0"),
   _U.chr("9"));
   var isOctDigit = A2(isBetween,
   _U.chr("0"),
   _U.chr("7"));
   var isHexDigit = function ($char) {
      return isDigit($char) || (A3(isBetween,
      _U.chr("a"),
      _U.chr("f"),
      $char) || A3(isBetween,
      _U.chr("A"),
      _U.chr("F"),
      $char));
   };
   _elm.Char.values = {_op: _op
                      ,isUpper: isUpper
                      ,isLower: isLower
                      ,isDigit: isDigit
                      ,isOctDigit: isOctDigit
                      ,isHexDigit: isHexDigit
                      ,toUpper: toUpper
                      ,toLower: toLower
                      ,toLocaleUpper: toLocaleUpper
                      ,toLocaleLower: toLocaleLower
                      ,toCode: toCode
                      ,fromCode: fromCode};
   return _elm.Char.values;
};
Elm.Color = Elm.Color || {};
Elm.Color.make = function (_elm) {
   "use strict";
   _elm.Color = _elm.Color || {};
   if (_elm.Color.values)
   return _elm.Color.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Color",
   $Basics = Elm.Basics.make(_elm);
   var Radial = F5(function (a,
   b,
   c,
   d,
   e) {
      return {ctor: "Radial"
             ,_0: a
             ,_1: b
             ,_2: c
             ,_3: d
             ,_4: e};
   });
   var radial = Radial;
   var Linear = F3(function (a,
   b,
   c) {
      return {ctor: "Linear"
             ,_0: a
             ,_1: b
             ,_2: c};
   });
   var linear = Linear;
   var fmod = F2(function (f,n) {
      return function () {
         var integer = $Basics.floor(f);
         return $Basics.toFloat(A2($Basics._op["%"],
         integer,
         n)) + f - $Basics.toFloat(integer);
      }();
   });
   var rgbToHsl = F3(function (red,
   green,
   blue) {
      return function () {
         var b = $Basics.toFloat(blue) / 255;
         var g = $Basics.toFloat(green) / 255;
         var r = $Basics.toFloat(red) / 255;
         var cMax = A2($Basics.max,
         A2($Basics.max,r,g),
         b);
         var cMin = A2($Basics.min,
         A2($Basics.min,r,g),
         b);
         var c = cMax - cMin;
         var lightness = (cMax + cMin) / 2;
         var saturation = _U.eq(lightness,
         0) ? 0 : c / (1 - $Basics.abs(2 * lightness - 1));
         var hue = $Basics.degrees(60) * (_U.eq(cMax,
         r) ? A2(fmod,
         (g - b) / c,
         6) : _U.eq(cMax,
         g) ? (b - r) / c + 2 : _U.eq(cMax,
         b) ? (r - g) / c + 4 : _U.badIf($moduleName,
         "between lines 150 and 152"));
         return {ctor: "_Tuple3"
                ,_0: hue
                ,_1: saturation
                ,_2: lightness};
      }();
   });
   var hslToRgb = F3(function (hue,
   saturation,
   lightness) {
      return function () {
         var hue$ = hue / $Basics.degrees(60);
         var chroma = (1 - $Basics.abs(2 * lightness - 1)) * saturation;
         var x = chroma * (1 - $Basics.abs(A2(fmod,
         hue$,
         2) - 1));
         var $ = _U.cmp(hue$,
         0) < 0 ? {ctor: "_Tuple3"
                  ,_0: 0
                  ,_1: 0
                  ,_2: 0} : _U.cmp(hue$,
         1) < 0 ? {ctor: "_Tuple3"
                  ,_0: chroma
                  ,_1: x
                  ,_2: 0} : _U.cmp(hue$,
         2) < 0 ? {ctor: "_Tuple3"
                  ,_0: x
                  ,_1: chroma
                  ,_2: 0} : _U.cmp(hue$,
         3) < 0 ? {ctor: "_Tuple3"
                  ,_0: 0
                  ,_1: chroma
                  ,_2: x} : _U.cmp(hue$,
         4) < 0 ? {ctor: "_Tuple3"
                  ,_0: 0
                  ,_1: x
                  ,_2: chroma} : _U.cmp(hue$,
         5) < 0 ? {ctor: "_Tuple3"
                  ,_0: x
                  ,_1: 0
                  ,_2: chroma} : _U.cmp(hue$,
         6) < 0 ? {ctor: "_Tuple3"
                  ,_0: chroma
                  ,_1: 0
                  ,_2: x} : {ctor: "_Tuple3"
                            ,_0: 0
                            ,_1: 0
                            ,_2: 0},
         r = $._0,
         g = $._1,
         b = $._2;
         var m = lightness - chroma / 2;
         return {ctor: "_Tuple3"
                ,_0: r + m
                ,_1: g + m
                ,_2: b + m};
      }();
   });
   var toRgb = function (color) {
      return function () {
         switch (color.ctor)
         {case "HSLA":
            return function () {
                 var $ = A3(hslToRgb,
                 color._0,
                 color._1,
                 color._2),
                 r = $._0,
                 g = $._1,
                 b = $._2;
                 return {_: {}
                        ,alpha: color._3
                        ,blue: $Basics.round(255 * b)
                        ,green: $Basics.round(255 * g)
                        ,red: $Basics.round(255 * r)};
              }();
            case "RGBA": return {_: {}
                                ,alpha: color._3
                                ,blue: color._2
                                ,green: color._1
                                ,red: color._0};}
         _U.badCase($moduleName,
         "between lines 124 and 132");
      }();
   };
   var toHsl = function (color) {
      return function () {
         switch (color.ctor)
         {case "HSLA": return {_: {}
                              ,alpha: color._3
                              ,hue: color._0
                              ,lightness: color._2
                              ,saturation: color._1};
            case "RGBA":
            return function () {
                 var $ = A3(rgbToHsl,
                 color._0,
                 color._1,
                 color._2),
                 h = $._0,
                 s = $._1,
                 l = $._2;
                 return {_: {}
                        ,alpha: color._3
                        ,hue: h
                        ,lightness: l
                        ,saturation: s};
              }();}
         _U.badCase($moduleName,
         "between lines 114 and 118");
      }();
   };
   var HSLA = F4(function (a,
   b,
   c,
   d) {
      return {ctor: "HSLA"
             ,_0: a
             ,_1: b
             ,_2: c
             ,_3: d};
   });
   var hsla = F4(function (hue,
   saturation,
   lightness,
   alpha) {
      return A4(HSLA,
      hue - $Basics.turns($Basics.toFloat($Basics.floor(hue / (2 * $Basics.pi)))),
      saturation,
      lightness,
      alpha);
   });
   var hsl = F3(function (hue,
   saturation,
   lightness) {
      return A4(hsla,
      hue,
      saturation,
      lightness,
      1);
   });
   var complement = function (color) {
      return function () {
         switch (color.ctor)
         {case "HSLA": return A4(hsla,
              color._0 + $Basics.degrees(180),
              color._1,
              color._2,
              color._3);
            case "RGBA":
            return function () {
                 var $ = A3(rgbToHsl,
                 color._0,
                 color._1,
                 color._2),
                 h = $._0,
                 s = $._1,
                 l = $._2;
                 return A4(hsla,
                 h + $Basics.degrees(180),
                 s,
                 l,
                 color._3);
              }();}
         _U.badCase($moduleName,
         "between lines 105 and 108");
      }();
   };
   var grayscale = function (p) {
      return A4(HSLA,0,0,1 - p,1);
   };
   var greyscale = function (p) {
      return A4(HSLA,0,0,1 - p,1);
   };
   var RGBA = F4(function (a,
   b,
   c,
   d) {
      return {ctor: "RGBA"
             ,_0: a
             ,_1: b
             ,_2: c
             ,_3: d};
   });
   var rgba = RGBA;
   var rgb = F3(function (r,g,b) {
      return A4(RGBA,r,g,b,1);
   });
   var lightRed = A4(RGBA,
   239,
   41,
   41,
   1);
   var red = A4(RGBA,204,0,0,1);
   var darkRed = A4(RGBA,
   164,
   0,
   0,
   1);
   var lightOrange = A4(RGBA,
   252,
   175,
   62,
   1);
   var orange = A4(RGBA,
   245,
   121,
   0,
   1);
   var darkOrange = A4(RGBA,
   206,
   92,
   0,
   1);
   var lightYellow = A4(RGBA,
   255,
   233,
   79,
   1);
   var yellow = A4(RGBA,
   237,
   212,
   0,
   1);
   var darkYellow = A4(RGBA,
   196,
   160,
   0,
   1);
   var lightGreen = A4(RGBA,
   138,
   226,
   52,
   1);
   var green = A4(RGBA,
   115,
   210,
   22,
   1);
   var darkGreen = A4(RGBA,
   78,
   154,
   6,
   1);
   var lightBlue = A4(RGBA,
   114,
   159,
   207,
   1);
   var blue = A4(RGBA,
   52,
   101,
   164,
   1);
   var darkBlue = A4(RGBA,
   32,
   74,
   135,
   1);
   var lightPurple = A4(RGBA,
   173,
   127,
   168,
   1);
   var purple = A4(RGBA,
   117,
   80,
   123,
   1);
   var darkPurple = A4(RGBA,
   92,
   53,
   102,
   1);
   var lightBrown = A4(RGBA,
   233,
   185,
   110,
   1);
   var brown = A4(RGBA,
   193,
   125,
   17,
   1);
   var darkBrown = A4(RGBA,
   143,
   89,
   2,
   1);
   var black = A4(RGBA,0,0,0,1);
   var white = A4(RGBA,
   255,
   255,
   255,
   1);
   var lightGrey = A4(RGBA,
   238,
   238,
   236,
   1);
   var grey = A4(RGBA,
   211,
   215,
   207,
   1);
   var darkGrey = A4(RGBA,
   186,
   189,
   182,
   1);
   var lightGray = A4(RGBA,
   238,
   238,
   236,
   1);
   var gray = A4(RGBA,
   211,
   215,
   207,
   1);
   var darkGray = A4(RGBA,
   186,
   189,
   182,
   1);
   var lightCharcoal = A4(RGBA,
   136,
   138,
   133,
   1);
   var charcoal = A4(RGBA,
   85,
   87,
   83,
   1);
   var darkCharcoal = A4(RGBA,
   46,
   52,
   54,
   1);
   _elm.Color.values = {_op: _op
                       ,rgb: rgb
                       ,rgba: rgba
                       ,hsl: hsl
                       ,hsla: hsla
                       ,greyscale: greyscale
                       ,grayscale: grayscale
                       ,complement: complement
                       ,linear: linear
                       ,radial: radial
                       ,toRgb: toRgb
                       ,toHsl: toHsl
                       ,red: red
                       ,orange: orange
                       ,yellow: yellow
                       ,green: green
                       ,blue: blue
                       ,purple: purple
                       ,brown: brown
                       ,lightRed: lightRed
                       ,lightOrange: lightOrange
                       ,lightYellow: lightYellow
                       ,lightGreen: lightGreen
                       ,lightBlue: lightBlue
                       ,lightPurple: lightPurple
                       ,lightBrown: lightBrown
                       ,darkRed: darkRed
                       ,darkOrange: darkOrange
                       ,darkYellow: darkYellow
                       ,darkGreen: darkGreen
                       ,darkBlue: darkBlue
                       ,darkPurple: darkPurple
                       ,darkBrown: darkBrown
                       ,white: white
                       ,lightGrey: lightGrey
                       ,grey: grey
                       ,darkGrey: darkGrey
                       ,lightCharcoal: lightCharcoal
                       ,charcoal: charcoal
                       ,darkCharcoal: darkCharcoal
                       ,black: black
                       ,lightGray: lightGray
                       ,gray: gray
                       ,darkGray: darkGray};
   return _elm.Color.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   if (_elm.Css.values)
   return _elm.Css.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $Html = Elm.Html.make(_elm),
   $Html$Attributes = Elm.Html.Attributes.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var style = F3(function (name,
   value,
   styles) {
      return A2($List.append,
      styles,
      _L.fromArray([{ctor: "_Tuple2"
                    ,_0: name
                    ,_1: value}]));
   });
   var setViewport = A3($Html.node,
   "meta",
   _L.fromArray([$Html$Attributes.name("viewport")
                ,$Html$Attributes.content("width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no")]),
   _L.fromArray([]));
   var url = function (path) {
      return A2($Basics._op["++"],
      "url(\"",
      A2($Basics._op["++"],
      path,
      "\")"));
   };
   var px = function (num) {
      return A2($Basics._op["++"],
      $Basics.toString(num),
      "px ");
   };
   var colorString = function (color) {
      return function () {
         var rgba = $Color.toRgb(color);
         var r = A2($Basics._op["++"],
         "rgba(",
         A2($Basics._op["++"],
         $Basics.toString(rgba.red),
         ", "));
         var g = A2($Basics._op["++"],
         $Basics.toString(rgba.green),
         ", ");
         var b = A2($Basics._op["++"],
         $Basics.toString(rgba.blue),
         ", ");
         var a = A2($Basics._op["++"],
         $Basics.toString(rgba.alpha),
         ")");
         return A2($Basics._op["++"],
         r,
         A2($Basics._op["++"],
         g,
         A2($Basics._op["++"],b,a)));
      }();
   };
   _elm.Css.values = {_op: _op
                     ,colorString: colorString
                     ,px: px
                     ,url: url
                     ,setViewport: setViewport
                     ,style: style};
   return _elm.Css.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Background = Elm.Css.Background || {};
Elm.Css.Background.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Background = _elm.Css.Background || {};
   if (_elm.Css.Background.values)
   return _elm.Css.Background.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Background",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $Css = Elm.Css.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var image = F2(function (path,
   styles) {
      return A3($Css.style,
      "background-image",
      $Css.url(path),
      styles);
   });
   var color = F2(function (c,
   styles) {
      return A3($Css.style,
      "background-color",
      $Css.colorString(c),
      styles);
   });
   var pointString = F2(function (x,
   y) {
      return A2($Basics._op["++"],
      $Css.px(x),
      $Css.px(y));
   });
   var position = F3(function (x,
   y,
   styles) {
      return A3($Css.style,
      "background-position",
      A2(pointString,x,y),
      styles);
   });
   var size = F3(function (width,
   height,
   styles) {
      return A3($Css.style,
      "background-size",
      A2(pointString,width,height),
      styles);
   });
   var attachmentString = function (attachment) {
      return function () {
         switch (attachment.ctor)
         {case "Fixed": return "fixed";
            case "Local": return "local";
            case "Scroll": return "scroll";}
         _U.badCase($moduleName,
         "between lines 94 and 102");
      }();
   };
   var attachment = F2(function (a,
   styles) {
      return A3($Css.style,
      "background-attachment",
      attachmentString(a),
      styles);
   });
   var repeatString = function (repeat) {
      return function () {
         switch (repeat.ctor)
         {case "NoRepeat":
            return "no-repeat";
            case "Repeat": return "repeat";
            case "RepeatX":
            return "repeat-x";
            case "RepeatY":
            return "repeat-y";}
         _U.badCase($moduleName,
         "between lines 72 and 83");
      }();
   };
   var repeat = F2(function (r,
   styles) {
      return A3($Css.style,
      "background-repeat",
      repeatString(r),
      styles);
   });
   var Local = {ctor: "Local"};
   var Fixed = {ctor: "Fixed"};
   var Scroll = {ctor: "Scroll"};
   var NoRepeat = {ctor: "NoRepeat"};
   var RepeatY = {ctor: "RepeatY"};
   var RepeatX = {ctor: "RepeatX"};
   var Repeat = {ctor: "Repeat"};
   _elm.Css.Background.values = {_op: _op
                                ,Repeat: Repeat
                                ,RepeatX: RepeatX
                                ,RepeatY: RepeatY
                                ,NoRepeat: NoRepeat
                                ,Scroll: Scroll
                                ,Fixed: Fixed
                                ,Local: Local
                                ,repeatString: repeatString
                                ,attachmentString: attachmentString
                                ,pointString: pointString
                                ,color: color
                                ,image: image
                                ,position: position
                                ,size: size
                                ,repeat: repeat
                                ,attachment: attachment};
   return _elm.Css.Background.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Border = Elm.Css.Border || {};
Elm.Css.Border.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Border = _elm.Css.Border || {};
   if (_elm.Css.Border.values)
   return _elm.Css.Border.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Border",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $Css = Elm.Css.make(_elm),
   $Css$Border$Bottom = Elm.Css.Border.Bottom.make(_elm),
   $Css$Border$Left = Elm.Css.Border.Left.make(_elm),
   $Css$Border$Right = Elm.Css.Border.Right.make(_elm),
   $Css$Border$Style = Elm.Css.Border.Style.make(_elm),
   $Css$Border$Top = Elm.Css.Border.Top.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var radius = F5(function (tl,
   tr,
   br,
   bl,
   styles) {
      return $Css$Border$Bottom.rightRadius(br)($Css$Border$Bottom.leftRadius(bl)($Css$Border$Top.rightRadius(tr)($Css$Border$Top.leftRadius(tl)(styles))));
   });
   var width = F5(function (t,
   r,
   b,
   l,
   styles) {
      return $Css$Border$Top.width(t)($Css$Border$Right.width(r)($Css$Border$Left.width(l)($Css$Border$Bottom.width(b)(styles))));
   });
   var style = F2(function (s,
   styles) {
      return $Css$Border$Top.style(s)($Css$Border$Right.style(s)($Css$Border$Left.style(s)($Css$Border$Bottom.style(s)(styles))));
   });
   var color = F2(function (c,
   styles) {
      return $Css$Border$Top.color(c)($Css$Border$Right.color(c)($Css$Border$Left.color(c)($Css$Border$Bottom.color(c)(styles))));
   });
   _elm.Css.Border.values = {_op: _op
                            ,color: color
                            ,style: style
                            ,width: width
                            ,radius: radius};
   return _elm.Css.Border.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Border = Elm.Css.Border || {};
Elm.Css.Border.Bottom = Elm.Css.Border.Bottom || {};
Elm.Css.Border.Bottom.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Border = _elm.Css.Border || {};
   _elm.Css.Border.Bottom = _elm.Css.Border.Bottom || {};
   if (_elm.Css.Border.Bottom.values)
   return _elm.Css.Border.Bottom.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Border.Bottom",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $Css = Elm.Css.make(_elm),
   $Css$Border$Style = Elm.Css.Border.Style.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var leftRadius = F2(function (l,
   styles) {
      return A3($Css.style,
      "border-bottom-left-radius",
      $Css.px(l),
      styles);
   });
   var rightRadius = F2(function (r,
   styles) {
      return A3($Css.style,
      "border-bottom-right-radius",
      $Css.px(r),
      styles);
   });
   var width = F2(function (w,
   styles) {
      return A3($Css.style,
      "border-bottom-width",
      $Css.px(w),
      styles);
   });
   var style = F2(function (s,
   styles) {
      return A3($Css.style,
      "border-bottom-style",
      $Css$Border$Style.string(s),
      styles);
   });
   var color = F2(function (c,
   styles) {
      return A3($Css.style,
      "border-bottom-color",
      $Css.colorString(c),
      styles);
   });
   _elm.Css.Border.Bottom.values = {_op: _op
                                   ,color: color
                                   ,style: style
                                   ,width: width
                                   ,rightRadius: rightRadius
                                   ,leftRadius: leftRadius};
   return _elm.Css.Border.Bottom.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Border = Elm.Css.Border || {};
Elm.Css.Border.Left = Elm.Css.Border.Left || {};
Elm.Css.Border.Left.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Border = _elm.Css.Border || {};
   _elm.Css.Border.Left = _elm.Css.Border.Left || {};
   if (_elm.Css.Border.Left.values)
   return _elm.Css.Border.Left.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Border.Left",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $Css = Elm.Css.make(_elm),
   $Css$Border$Style = Elm.Css.Border.Style.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var width = F2(function (w,
   styles) {
      return A3($Css.style,
      "border-left-width",
      $Css.px(w),
      styles);
   });
   var style = F2(function (s,
   styles) {
      return A3($Css.style,
      "border-left-style",
      $Css$Border$Style.string(s),
      styles);
   });
   var color = F2(function (c,
   styles) {
      return A3($Css.style,
      "border-left-color",
      $Css.colorString(c),
      styles);
   });
   _elm.Css.Border.Left.values = {_op: _op
                                 ,color: color
                                 ,style: style
                                 ,width: width};
   return _elm.Css.Border.Left.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Border = Elm.Css.Border || {};
Elm.Css.Border.Right = Elm.Css.Border.Right || {};
Elm.Css.Border.Right.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Border = _elm.Css.Border || {};
   _elm.Css.Border.Right = _elm.Css.Border.Right || {};
   if (_elm.Css.Border.Right.values)
   return _elm.Css.Border.Right.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Border.Right",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $Css = Elm.Css.make(_elm),
   $Css$Border$Style = Elm.Css.Border.Style.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var width = F2(function (w,
   styles) {
      return A3($Css.style,
      "border-right-width",
      $Css.px(w),
      styles);
   });
   var style = F2(function (s,
   styles) {
      return A3($Css.style,
      "border-right-style",
      $Css$Border$Style.string(s),
      styles);
   });
   var color = F2(function (c,
   styles) {
      return A3($Css.style,
      "border-right-color",
      $Css.colorString(c),
      styles);
   });
   _elm.Css.Border.Right.values = {_op: _op
                                  ,color: color
                                  ,style: style
                                  ,width: width};
   return _elm.Css.Border.Right.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Border = Elm.Css.Border || {};
Elm.Css.Border.Style = Elm.Css.Border.Style || {};
Elm.Css.Border.Style.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Border = _elm.Css.Border || {};
   _elm.Css.Border.Style = _elm.Css.Border.Style || {};
   if (_elm.Css.Border.Style.values)
   return _elm.Css.Border.Style.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Border.Style",
   $Basics = Elm.Basics.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var string = function (style) {
      return function () {
         switch (style.ctor)
         {case "Dashed": return "dashed";
            case "Dotted": return "dotted";
            case "Double": return "double";
            case "Groove": return "groove";
            case "Hidden": return "hidden";
            case "Inset": return "inset";
            case "None": return "none";
            case "Outset": return "outset";
            case "Ridge": return "ridge";
            case "Solid": return "solid";}
         _U.badCase($moduleName,
         "between lines 72 and 101");
      }();
   };
   var Outset = {ctor: "Outset"};
   var Inset = {ctor: "Inset"};
   var Ridge = {ctor: "Ridge"};
   var Groove = {ctor: "Groove"};
   var Double = {ctor: "Double"};
   var Solid = {ctor: "Solid"};
   var Dashed = {ctor: "Dashed"};
   var Dotted = {ctor: "Dotted"};
   var Hidden = {ctor: "Hidden"};
   var None = {ctor: "None"};
   _elm.Css.Border.Style.values = {_op: _op
                                  ,None: None
                                  ,Hidden: Hidden
                                  ,Dotted: Dotted
                                  ,Dashed: Dashed
                                  ,Solid: Solid
                                  ,Double: Double
                                  ,Groove: Groove
                                  ,Ridge: Ridge
                                  ,Inset: Inset
                                  ,Outset: Outset
                                  ,string: string};
   return _elm.Css.Border.Style.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Border = Elm.Css.Border || {};
Elm.Css.Border.Top = Elm.Css.Border.Top || {};
Elm.Css.Border.Top.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Border = _elm.Css.Border || {};
   _elm.Css.Border.Top = _elm.Css.Border.Top || {};
   if (_elm.Css.Border.Top.values)
   return _elm.Css.Border.Top.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Border.Top",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $Css = Elm.Css.make(_elm),
   $Css$Border$Style = Elm.Css.Border.Style.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var leftRadius = F2(function (l,
   styles) {
      return A3($Css.style,
      "border-top-left-radius",
      $Css.px(l),
      styles);
   });
   var rightRadius = F2(function (r,
   styles) {
      return A3($Css.style,
      "border-top-right-radius",
      $Css.px(r),
      styles);
   });
   var width = F2(function (w,
   styles) {
      return A3($Css.style,
      "border-top-width",
      $Css.px(w),
      styles);
   });
   var style = F2(function (s,
   styles) {
      return A3($Css.style,
      "border-top-style",
      $Css$Border$Style.string(s),
      styles);
   });
   var color = F2(function (c,
   styles) {
      return A3($Css.style,
      "border-top-color",
      $Css.colorString(c),
      styles);
   });
   _elm.Css.Border.Top.values = {_op: _op
                                ,color: color
                                ,style: style
                                ,width: width
                                ,rightRadius: rightRadius
                                ,leftRadius: leftRadius};
   return _elm.Css.Border.Top.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Cursor = Elm.Css.Cursor || {};
Elm.Css.Cursor.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Cursor = _elm.Css.Cursor || {};
   if (_elm.Css.Cursor.values)
   return _elm.Css.Cursor.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Cursor",
   $Basics = Elm.Basics.make(_elm),
   $Css = Elm.Css.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $Vendor = Elm.Vendor.make(_elm);
   var string = function (cursor) {
      return function () {
         switch (cursor.ctor)
         {case "Alias": return "alias";
            case "AllScroll":
            return "all-scroll";
            case "Auto": return "auto";
            case "Cell": return "cell";
            case "ColResize":
            return "col-resize";
            case "ContextMenu":
            return "context-menu";
            case "Copy": return "copy";
            case "Crosshair":
            return "crosshair";
            case "Default":
            return "default";
            case "EResize":
            return "e-resize";
            case "EwResize":
            return "ew-resize";
            case "Grab": return "grab";
            case "Grabbing":
            return "grabbign";
            case "Help": return "help";
            case "Move": return "move";
            case "NResize":
            return "n-resize";
            case "NeResize":
            return "ne-resize";
            case "NeswResize":
            return "nesw-resize";
            case "NoDrop": return "no-drop";
            case "None": return "none";
            case "NotAllowed":
            return "not-allowed";
            case "NsResize":
            return "ns-resize";
            case "NwResize":
            return "nw-resize";
            case "NwseResize":
            return "nwse-resize";
            case "Pointer":
            return "pointer";
            case "Progress":
            return "progress";
            case "RowResize":
            return "row-resize";
            case "SResize":
            return "s-resize";
            case "SeResize":
            return "se-resize";
            case "SwResize":
            return "sw-resize";
            case "Text": return "text";
            case "Url":
            return $Css.url(cursor._0);
            case "VerticalText":
            return "vertical-text";
            case "WResize":
            return "w-resize";
            case "Wait": return "wait";
            case "ZoomIn": return "zoom-in";
            case "ZoomOut":
            return "zoom-out";}
         _U.badCase($moduleName,
         "between lines 189 and 299");
      }();
   };
   var cursor = F2(function (c,
   styles) {
      return function () {
         var name = "cursor";
         var prefix = $Vendor.prefix;
         return function () {
            switch (c.ctor)
            {case "Grab":
               return _U.eq(prefix,
                 $Vendor.Webkit) ? A3($Css.style,
                 name,
                 A2($Basics._op["++"],
                 "-webkit-",
                 string(c)),
                 styles) : A3($Css.style,
                 name,
                 string(c),
                 styles);
               case "ZoomIn":
               return _U.eq(prefix,
                 $Vendor.Webkit) ? A3($Css.style,
                 name,
                 A2($Basics._op["++"],
                 "-webkit-",
                 string(c)),
                 styles) : A3($Css.style,
                 name,
                 string(c),
                 styles);
               case "ZoomOut":
               return _U.eq(prefix,
                 $Vendor.Webkit) ? A3($Css.style,
                 name,
                 A2($Basics._op["++"],
                 "-webkit-",
                 string(c)),
                 styles) : A3($Css.style,
                 name,
                 string(c),
                 styles);}
            return A3($Css.style,
            "cursor",
            string(c),
            styles);
         }();
      }();
   });
   var ZoomOut = {ctor: "ZoomOut"};
   var ZoomIn = {ctor: "ZoomIn"};
   var Wait = {ctor: "Wait"};
   var WResize = {ctor: "WResize"};
   var VerticalText = {ctor: "VerticalText"};
   var Url = function (a) {
      return {ctor: "Url",_0: a};
   };
   var Text = {ctor: "Text"};
   var SwResize = {ctor: "SwResize"};
   var SeResize = {ctor: "SeResize"};
   var SResize = {ctor: "SResize"};
   var RowResize = {ctor: "RowResize"};
   var Progress = {ctor: "Progress"};
   var Pointer = {ctor: "Pointer"};
   var NotAllowed = {ctor: "NotAllowed"};
   var None = {ctor: "None"};
   var NoDrop = {ctor: "NoDrop"};
   var NwseResize = {ctor: "NwseResize"};
   var NwResize = {ctor: "NwResize"};
   var NsResize = {ctor: "NsResize"};
   var NeswResize = {ctor: "NeswResize"};
   var NeResize = {ctor: "NeResize"};
   var NResize = {ctor: "NResize"};
   var Move = {ctor: "Move"};
   var Help = {ctor: "Help"};
   var Grabbing = {ctor: "Grabbing"};
   var Grab = {ctor: "Grab"};
   var EwResize = {ctor: "EwResize"};
   var EResize = {ctor: "EResize"};
   var Default = {ctor: "Default"};
   var Crosshair = {ctor: "Crosshair"};
   var Copy = {ctor: "Copy"};
   var ColResize = {ctor: "ColResize"};
   var ContextMenu = {ctor: "ContextMenu"};
   var Cell = {ctor: "Cell"};
   var Auto = {ctor: "Auto"};
   var AllScroll = {ctor: "AllScroll"};
   var Alias = {ctor: "Alias"};
   _elm.Css.Cursor.values = {_op: _op
                            ,Alias: Alias
                            ,AllScroll: AllScroll
                            ,Auto: Auto
                            ,Cell: Cell
                            ,ContextMenu: ContextMenu
                            ,ColResize: ColResize
                            ,Copy: Copy
                            ,Crosshair: Crosshair
                            ,Default: Default
                            ,EResize: EResize
                            ,EwResize: EwResize
                            ,Grab: Grab
                            ,Grabbing: Grabbing
                            ,Help: Help
                            ,Move: Move
                            ,NResize: NResize
                            ,NeResize: NeResize
                            ,NeswResize: NeswResize
                            ,NsResize: NsResize
                            ,NwResize: NwResize
                            ,NwseResize: NwseResize
                            ,NoDrop: NoDrop
                            ,None: None
                            ,NotAllowed: NotAllowed
                            ,Pointer: Pointer
                            ,Progress: Progress
                            ,RowResize: RowResize
                            ,SResize: SResize
                            ,SeResize: SeResize
                            ,SwResize: SwResize
                            ,Text: Text
                            ,Url: Url
                            ,VerticalText: VerticalText
                            ,WResize: WResize
                            ,Wait: Wait
                            ,ZoomIn: ZoomIn
                            ,ZoomOut: ZoomOut
                            ,string: string
                            ,cursor: cursor};
   return _elm.Css.Cursor.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Dimension = Elm.Css.Dimension || {};
Elm.Css.Dimension.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Dimension = _elm.Css.Dimension || {};
   if (_elm.Css.Dimension.values)
   return _elm.Css.Dimension.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Dimension",
   $Basics = Elm.Basics.make(_elm),
   $Css = Elm.Css.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var width = F2(function (w,
   styles) {
      return A3($Css.style,
      "width",
      $Css.px(w),
      styles);
   });
   var minWidth = F2(function (w,
   styles) {
      return A3($Css.style,
      "min-width",
      $Css.px(w),
      styles);
   });
   var minHeight = F2(function (h,
   styles) {
      return A3($Css.style,
      "min-height",
      $Css.px(h),
      styles);
   });
   var maxWidth = F2(function (w,
   styles) {
      return A3($Css.style,
      "max-width",
      $Css.px(w),
      styles);
   });
   var maxHeight = F2(function (h,
   styles) {
      return A3($Css.style,
      "max-height",
      $Css.px(h),
      styles);
   });
   var height = F2(function (h,
   styles) {
      return A3($Css.style,
      "height",
      $Css.px(h),
      styles);
   });
   _elm.Css.Dimension.values = {_op: _op
                               ,height: height
                               ,maxHeight: maxHeight
                               ,maxWidth: maxWidth
                               ,minHeight: minHeight
                               ,minWidth: minWidth
                               ,width: width};
   return _elm.Css.Dimension.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Display = Elm.Css.Display || {};
Elm.Css.Display.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Display = _elm.Css.Display || {};
   if (_elm.Css.Display.values)
   return _elm.Css.Display.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Display",
   $Basics = Elm.Basics.make(_elm),
   $Css = Elm.Css.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $Vendor = Elm.Vendor.make(_elm);
   var string = function (display) {
      return function () {
         switch (display.ctor)
         {case "Block": return "block";
            case "Flex": return "flex";
            case "Inline": return "inline";
            case "InlineBlock":
            return "inline-block";
            case "InlineFlex":
            return "inline-flex";
            case "InlineTable":
            return "inline-table";
            case "ListItem":
            return "list-item";
            case "None": return "none";
            case "RunIn": return "run-in";
            case "Table": return "table";
            case "TableCaption":
            return "table-caption";
            case "TableCell":
            return "table-cell";
            case "TableColumn":
            return "table-column";
            case "TableColumnGroup":
            return "table-column-group";
            case "TableFooterGroup":
            return "table-footer-group";
            case "TableHeaderGroup":
            return "table-header-group";
            case "TableRow":
            return "table-row";
            case "TableRowGroup":
            return "table-row-group";}
         _U.badCase($moduleName,
         "between lines 109 and 162");
      }();
   };
   var display = F2(function (d,
   styles) {
      return function () {
         var prefix = $Vendor.prefix;
         return function () {
            switch (d.ctor)
            {case "Flex":
               return _U.eq(prefix,
                 $Vendor.Webkit) ? A3($Css.style,
                 "display",
                 "-webkit-flex",
                 styles) : _U.eq(prefix,
                 $Vendor.MS) ? A3($Css.style,
                 "display",
                 "-ms-flexbox",
                 styles) : A3($Css.style,
                 "display",
                 "flex",
                 styles);
               case "InlineFlex":
               return _U.eq(prefix,
                 $Vendor.Webkit) ? A3($Css.style,
                 "display",
                 "-webkit-inline-flex",
                 styles) : _U.eq(prefix,
                 $Vendor.MS) ? A3($Css.style,
                 "display",
                 "-ms-infline-flexbox",
                 styles) : A3($Css.style,
                 "display",
                 "flex",
                 styles);}
            return A3($Css.style,
            "display",
            string(d),
            styles);
         }();
      }();
   });
   var None = {ctor: "None"};
   var TableRow = {ctor: "TableRow"};
   var TableColumn = {ctor: "TableColumn"};
   var TableCell = {ctor: "TableCell"};
   var TableRowGroup = {ctor: "TableRowGroup"};
   var TableFooterGroup = {ctor: "TableFooterGroup"};
   var TableHeaderGroup = {ctor: "TableHeaderGroup"};
   var TableColumnGroup = {ctor: "TableColumnGroup"};
   var TableCaption = {ctor: "TableCaption"};
   var Table = {ctor: "Table"};
   var RunIn = {ctor: "RunIn"};
   var ListItem = {ctor: "ListItem"};
   var InlineTable = {ctor: "InlineTable"};
   var InlineFlex = {ctor: "InlineFlex"};
   var InlineBlock = {ctor: "InlineBlock"};
   var Flex = {ctor: "Flex"};
   var Block = {ctor: "Block"};
   var Inline = {ctor: "Inline"};
   _elm.Css.Display.values = {_op: _op
                             ,Inline: Inline
                             ,Block: Block
                             ,Flex: Flex
                             ,InlineBlock: InlineBlock
                             ,InlineFlex: InlineFlex
                             ,InlineTable: InlineTable
                             ,ListItem: ListItem
                             ,RunIn: RunIn
                             ,Table: Table
                             ,TableCaption: TableCaption
                             ,TableColumnGroup: TableColumnGroup
                             ,TableHeaderGroup: TableHeaderGroup
                             ,TableFooterGroup: TableFooterGroup
                             ,TableRowGroup: TableRowGroup
                             ,TableCell: TableCell
                             ,TableColumn: TableColumn
                             ,TableRow: TableRow
                             ,None: None
                             ,string: string
                             ,display: display};
   return _elm.Css.Display.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Font = Elm.Css.Font || {};
Elm.Css.Font.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Font = _elm.Css.Font || {};
   if (_elm.Css.Font.values)
   return _elm.Css.Font.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Font",
   $Basics = Elm.Basics.make(_elm),
   $Css = Elm.Css.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var weight = F2(function (w,
   styles) {
      return function () {
         var ub = _U.cmp(w,
         9) > 0 ? 9 : w;
         var lb = _U.cmp(ub,
         1) < 0 ? 1 : ub;
         return A3($Css.style,
         "font-weight",
         $Basics.toString(lb * 100),
         styles);
      }();
   });
   var size = F2(function (length,
   styles) {
      return A3($Css.style,
      "font-size",
      $Css.px(length),
      styles);
   });
   var family = F2(function (f,
   styles) {
      return A3($Css.style,
      "font-family",
      f,
      styles);
   });
   var variantString = function (v) {
      return function () {
         switch (v.ctor)
         {case "NormalVariant":
            return "normal";
            case "SmallCaps":
            return "small-caps";}
         _U.badCase($moduleName,
         "between lines 88 and 93");
      }();
   };
   var variant = F2(function (v,
   styles) {
      return A3($Css.style,
      "font-variant",
      variantString(v),
      styles);
   });
   var styleString = function (style) {
      return function () {
         switch (style.ctor)
         {case "Italic": return "italic";
            case "NormalStyle":
            return "normal";
            case "Oblique":
            return "oblique";}
         _U.badCase($moduleName,
         "between lines 69 and 77");
      }();
   };
   var style = F2(function (s,
   styles) {
      return A3($Css.style,
      "font-style",
      styleString(s),
      styles);
   });
   var SmallCaps = {ctor: "SmallCaps"};
   var NormalVariant = {ctor: "NormalVariant"};
   var Oblique = {ctor: "Oblique"};
   var Italic = {ctor: "Italic"};
   var NormalStyle = {ctor: "NormalStyle"};
   _elm.Css.Font.values = {_op: _op
                          ,NormalStyle: NormalStyle
                          ,Italic: Italic
                          ,Oblique: Oblique
                          ,NormalVariant: NormalVariant
                          ,SmallCaps: SmallCaps
                          ,styleString: styleString
                          ,variantString: variantString
                          ,family: family
                          ,size: size
                          ,style: style
                          ,variant: variant
                          ,weight: weight};
   return _elm.Css.Font.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Gradient = Elm.Css.Gradient || {};
Elm.Css.Gradient.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Gradient = _elm.Css.Gradient || {};
   if (_elm.Css.Gradient.values)
   return _elm.Css.Gradient.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Gradient",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $Css = Elm.Css.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $String = Elm.String.make(_elm),
   $Vendor = Elm.Vendor.make(_elm);
   var radial = F2(function (colors,
   styles) {
      return function () {
         var name = "background";
         var prefix = $Vendor.prefix;
         var colorStrings = A2($String.join,
         ",",
         A2($List.map,
         $Css.colorString,
         colors));
         var string = A2($Basics._op["++"],
         "radial-gradient(",
         A2($Basics._op["++"],
         colorStrings,
         ")"));
         return _U.eq(prefix,
         $Vendor.Webkit) ? A3($Css.style,
         name,
         A2($Basics._op["++"],
         "-webkit-",
         string),
         styles) : _U.eq(prefix,
         $Vendor.Moz) ? A3($Css.style,
         name,
         A2($Basics._op["++"],
         "-moz-",
         string),
         styles) : _U.eq(prefix,
         $Vendor.O) ? A3($Css.style,
         name,
         A2($Basics._op["++"],
         "-o-",
         string),
         styles) : A3($Css.style,
         name,
         string,
         styles);
      }();
   });
   var linear = F3(function (degrees,
   colors,
   styles) {
      return function () {
         var name = "background";
         var prefix = $Vendor.prefix;
         var degreeString = A2($Basics._op["++"],
         $Basics.toString(degrees),
         "deg, ");
         var colorStrings = A2($String.join,
         ",",
         A2($List.map,
         $Css.colorString,
         colors));
         var string = A2($Basics._op["++"],
         "linear-gradient(",
         A2($Basics._op["++"],
         degreeString,
         A2($Basics._op["++"],
         colorStrings,
         ")")));
         return _U.eq(prefix,
         $Vendor.Webkit) ? A3($Css.style,
         name,
         A2($Basics._op["++"],
         "-webkit-",
         string),
         styles) : _U.eq(prefix,
         $Vendor.Moz) ? A3($Css.style,
         name,
         A2($Basics._op["++"],
         "-moz-",
         string),
         styles) : _U.eq(prefix,
         $Vendor.O) ? A3($Css.style,
         name,
         A2($Basics._op["++"],
         "-o-",
         string),
         styles) : A3($Css.style,
         name,
         string,
         styles);
      }();
   });
   _elm.Css.Gradient.values = {_op: _op
                              ,linear: linear
                              ,radial: radial};
   return _elm.Css.Gradient.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.ListStyle = Elm.Css.ListStyle || {};
Elm.Css.ListStyle.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.ListStyle = _elm.Css.ListStyle || {};
   if (_elm.Css.ListStyle.values)
   return _elm.Css.ListStyle.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.ListStyle",
   $Basics = Elm.Basics.make(_elm),
   $Css = Elm.Css.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var image = F2(function (path,
   styles) {
      return A3($Css.style,
      "list-style-image",
      $Css.url(path),
      styles);
   });
   var bulletTypeString = function (t) {
      return function () {
         switch (t.ctor)
         {case "Armenian":
            return "armenian";
            case "Circle": return "circle";
            case "CjkIdeographic":
            return "cjk-ideographic";
            case "Decimal":
            return "decimal";
            case "DecimalLeadingZero":
            return "decimal-leading-zero";
            case "Disc": return "disc";
            case "Georgian":
            return "georgian";
            case "Hebrew": return "hebrew";
            case "Hiragana":
            return "hiragana";
            case "HiraganaIroha":
            return "hiragana-iroha";
            case "Katakana":
            return "katakana";
            case "KatakanaIroha":
            return "katakana-iroha";
            case "LowerAlpha":
            return "lower-alpha";
            case "LowerGreek":
            return "lower-greek";
            case "LowerLatin":
            return "lower-latin";
            case "LowerRoman":
            return "lower-roman";
            case "None": return "none";
            case "Square": return "square";
            case "UpperAlpha":
            return "upper-alpha";
            case "UpperLatin":
            return "upper-latin";
            case "UpperRoman":
            return "upper-roman";}
         _U.badCase($moduleName,
         "between lines 148 and 210");
      }();
   };
   var bulletType = F2(function (t,
   styles) {
      return A3($Css.style,
      "list-style-type",
      bulletTypeString(t),
      styles);
   });
   var positionString = function (position) {
      return function () {
         switch (position.ctor)
         {case "Inside": return "inside";
            case "Outside":
            return "outside";}
         _U.badCase($moduleName,
         "between lines 132 and 137");
      }();
   };
   var position = F2(function (p,
   styles) {
      return A3($Css.style,
      "list-style-position",
      positionString(p),
      styles);
   });
   var UpperRoman = {ctor: "UpperRoman"};
   var UpperLatin = {ctor: "UpperLatin"};
   var UpperAlpha = {ctor: "UpperAlpha"};
   var Square = {ctor: "Square"};
   var None = {ctor: "None"};
   var LowerRoman = {ctor: "LowerRoman"};
   var LowerLatin = {ctor: "LowerLatin"};
   var LowerGreek = {ctor: "LowerGreek"};
   var LowerAlpha = {ctor: "LowerAlpha"};
   var KatakanaIroha = {ctor: "KatakanaIroha"};
   var Katakana = {ctor: "Katakana"};
   var HiraganaIroha = {ctor: "HiraganaIroha"};
   var Hiragana = {ctor: "Hiragana"};
   var Hebrew = {ctor: "Hebrew"};
   var Georgian = {ctor: "Georgian"};
   var DecimalLeadingZero = {ctor: "DecimalLeadingZero"};
   var Decimal = {ctor: "Decimal"};
   var CjkIdeographic = {ctor: "CjkIdeographic"};
   var Circle = {ctor: "Circle"};
   var Armenian = {ctor: "Armenian"};
   var Disc = {ctor: "Disc"};
   var Outside = {ctor: "Outside"};
   var Inside = {ctor: "Inside"};
   _elm.Css.ListStyle.values = {_op: _op
                               ,Inside: Inside
                               ,Outside: Outside
                               ,Disc: Disc
                               ,Armenian: Armenian
                               ,Circle: Circle
                               ,CjkIdeographic: CjkIdeographic
                               ,Decimal: Decimal
                               ,DecimalLeadingZero: DecimalLeadingZero
                               ,Georgian: Georgian
                               ,Hebrew: Hebrew
                               ,Hiragana: Hiragana
                               ,HiraganaIroha: HiraganaIroha
                               ,Katakana: Katakana
                               ,KatakanaIroha: KatakanaIroha
                               ,LowerAlpha: LowerAlpha
                               ,LowerGreek: LowerGreek
                               ,LowerLatin: LowerLatin
                               ,LowerRoman: LowerRoman
                               ,None: None
                               ,Square: Square
                               ,UpperAlpha: UpperAlpha
                               ,UpperLatin: UpperLatin
                               ,UpperRoman: UpperRoman
                               ,positionString: positionString
                               ,bulletTypeString: bulletTypeString
                               ,image: image
                               ,position: position
                               ,bulletType: bulletType};
   return _elm.Css.ListStyle.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Margin = Elm.Css.Margin || {};
Elm.Css.Margin.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Margin = _elm.Css.Margin || {};
   if (_elm.Css.Margin.values)
   return _elm.Css.Margin.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Margin",
   $Basics = Elm.Basics.make(_elm),
   $Css = Elm.Css.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var top = F2(function (t,
   styles) {
      return A3($Css.style,
      "margin-top",
      $Css.px(t),
      styles);
   });
   var right = F2(function (r,
   styles) {
      return A3($Css.style,
      "margin-right",
      $Css.px(r),
      styles);
   });
   var left = F2(function (l,
   styles) {
      return A3($Css.style,
      "margin-left",
      $Css.px(l),
      styles);
   });
   var bottom = F2(function (b,
   styles) {
      return A3($Css.style,
      "margin-bottom",
      $Css.px(b),
      styles);
   });
   var all = F5(function (t,
   r,
   b,
   l,
   styles) {
      return left(l)(bottom(b)(right(r)(top(t)(styles))));
   });
   _elm.Css.Margin.values = {_op: _op
                            ,bottom: bottom
                            ,left: left
                            ,right: right
                            ,top: top
                            ,all: all};
   return _elm.Css.Margin.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Padding = Elm.Css.Padding || {};
Elm.Css.Padding.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Padding = _elm.Css.Padding || {};
   if (_elm.Css.Padding.values)
   return _elm.Css.Padding.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Padding",
   $Basics = Elm.Basics.make(_elm),
   $Css = Elm.Css.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var top = F2(function (t,
   styles) {
      return A3($Css.style,
      "padding-top",
      $Css.px(t),
      styles);
   });
   var right = F2(function (r,
   styles) {
      return A3($Css.style,
      "padding-right",
      $Css.px(r),
      styles);
   });
   var left = F2(function (l,
   styles) {
      return A3($Css.style,
      "padding-left",
      $Css.px(l),
      styles);
   });
   var bottom = F2(function (b,
   styles) {
      return A3($Css.style,
      "padding-bottom",
      $Css.px(b),
      styles);
   });
   var all = F5(function (t,
   r,
   b,
   l,
   styles) {
      return left(l)(bottom(b)(right(r)(top(t)(styles))));
   });
   _elm.Css.Padding.values = {_op: _op
                             ,bottom: bottom
                             ,left: left
                             ,right: right
                             ,top: top
                             ,all: all};
   return _elm.Css.Padding.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Position = Elm.Css.Position || {};
Elm.Css.Position.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Position = _elm.Css.Position || {};
   if (_elm.Css.Position.values)
   return _elm.Css.Position.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Position",
   $Basics = Elm.Basics.make(_elm),
   $Css = Elm.Css.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var zIndex = F2(function (p,
   styles) {
      return A3($Css.style,
      "z-index",
      $Basics.toString(p),
      styles);
   });
   var top = F2(function (t,
   styles) {
      return A3($Css.style,
      "top",
      $Css.px(t),
      styles);
   });
   var right = F2(function (r,
   styles) {
      return A3($Css.style,
      "right",
      $Css.px(r),
      styles);
   });
   var left = F2(function (l,
   styles) {
      return A3($Css.style,
      "left",
      $Css.px(l),
      styles);
   });
   var bottom = F2(function (b,
   styles) {
      return A3($Css.style,
      "bottom",
      $Css.px(b),
      styles);
   });
   var clip = F5(function (t,
   r,
   b,
   l,
   styles) {
      return function () {
         var string = A2($Basics._op["++"],
         "rect(",
         A2($Basics._op["++"],
         $Basics.toString(t),
         A2($Basics._op["++"],
         "px, ",
         A2($Basics._op["++"],
         $Basics.toString(r),
         A2($Basics._op["++"],
         "px, ",
         A2($Basics._op["++"],
         $Basics.toString(b),
         A2($Basics._op["++"],
         "px, ",
         A2($Basics._op["++"],
         $Basics.toString(l),
         "px)"))))))));
         return A3($Css.style,
         "clip",
         string,
         styles);
      }();
   });
   var positionString = function (position) {
      return function () {
         switch (position.ctor)
         {case "Absolute":
            return "absolute";
            case "Fixed": return "fixed";
            case "Relative":
            return "relative";
            case "Static": return "static";}
         _U.badCase($moduleName,
         "between lines 100 and 111");
      }();
   };
   var position = F2(function (p,
   styles) {
      return A3($Css.style,
      "position",
      positionString(p),
      styles);
   });
   var overflowString = function (overflow) {
      return function () {
         switch (overflow.ctor)
         {case "AutoOverflow":
            return "auto";
            case "Hidden": return "hidden";
            case "Scroll": return "scroll";
            case "Visible":
            return "visible";}
         _U.badCase($moduleName,
         "between lines 78 and 89");
      }();
   };
   var overflow = F2(function (o,
   styles) {
      return A3($Css.style,
      "overflow",
      overflowString(o),
      styles);
   });
   var Static = {ctor: "Static"};
   var Relative = {ctor: "Relative"};
   var Fixed = {ctor: "Fixed"};
   var Absolute = {ctor: "Absolute"};
   var Visible = {ctor: "Visible"};
   var Scroll = {ctor: "Scroll"};
   var Hidden = {ctor: "Hidden"};
   var AutoOverflow = {ctor: "AutoOverflow"};
   _elm.Css.Position.values = {_op: _op
                              ,AutoOverflow: AutoOverflow
                              ,Hidden: Hidden
                              ,Scroll: Scroll
                              ,Visible: Visible
                              ,Absolute: Absolute
                              ,Fixed: Fixed
                              ,Relative: Relative
                              ,Static: Static
                              ,overflowString: overflowString
                              ,positionString: positionString
                              ,clip: clip
                              ,bottom: bottom
                              ,left: left
                              ,overflow: overflow
                              ,position: position
                              ,right: right
                              ,top: top
                              ,zIndex: zIndex};
   return _elm.Css.Position.values;
};
Elm.Css = Elm.Css || {};
Elm.Css.Text = Elm.Css.Text || {};
Elm.Css.Text.make = function (_elm) {
   "use strict";
   _elm.Css = _elm.Css || {};
   _elm.Css.Text = _elm.Css.Text || {};
   if (_elm.Css.Text.values)
   return _elm.Css.Text.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Css.Text",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $Css = Elm.Css.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var wordSpacing = F2(function (length,
   styles) {
      return A3($Css.style,
      "word-spacing",
      $Css.px(length),
      styles);
   });
   var indent = F2(function (length,
   styles) {
      return A3($Css.style,
      "text-indent",
      $Css.px(length),
      styles);
   });
   var lineHeight = F2(function (length,
   styles) {
      return A3($Css.style,
      "line-height",
      $Css.px(length),
      styles);
   });
   var letterSpacing = F2(function (length,
   styles) {
      return A3($Css.style,
      "letter-spacing",
      $Css.px(length),
      styles);
   });
   var color = F2(function (c,
   styles) {
      return A3($Css.style,
      "color",
      $Css.colorString(c),
      styles);
   });
   var whiteSpaceString = function (whiteSpace) {
      return function () {
         switch (whiteSpace.ctor)
         {case "NoWrap": return "nowrap";
            case "NormalWhiteSpace":
            return "normal";
            case "Pre": return "pre";
            case "PreLine":
            return "pre-line";
            case "PreWrap":
            return "pre-wrap";}
         _U.badCase($moduleName,
         "between lines 215 and 229");
      }();
   };
   var whiteSpace = F2(function (ws,
   styles) {
      return A3($Css.style,
      "white-space",
      whiteSpaceString(ws),
      styles);
   });
   var unicodeBidiString = function (unicodeBidi) {
      return function () {
         switch (unicodeBidi.ctor)
         {case "BidiOverride":
            return "bidi-override";
            case "Embed": return "embed";
            case "NormalUnicodeBidi":
            return "normal";}
         _U.badCase($moduleName,
         "between lines 197 and 205");
      }();
   };
   var unicodeBidi = F2(function (u,
   styles) {
      return A3($Css.style,
      "unicode-bidi",
      unicodeBidiString(u),
      styles);
   });
   var decorationString = function (decoration) {
      return function () {
         switch (decoration.ctor)
         {case "LineThrough":
            return "line-through";
            case "NoDecoration":
            return "none";
            case "Overline":
            return "overline";
            case "Underline":
            return "underline";}
         _U.badCase($moduleName,
         "between lines 175 and 186");
      }();
   };
   var decoration = F2(function (d,
   styles) {
      return A3($Css.style,
      "text-decoration",
      decorationString(d),
      styles);
   });
   var alignString = function (align) {
      return function () {
         switch (align.ctor)
         {case "Center": return "center";
            case "Justify":
            return "justify";
            case "Left": return "left";
            case "Right": return "right";}
         _U.badCase($moduleName,
         "between lines 153 and 164");
      }();
   };
   var align = F2(function (a,
   styles) {
      return A3($Css.style,
      "text-align",
      alignString(a),
      styles);
   });
   var directionString = function (direction) {
      return function () {
         switch (direction.ctor)
         {case "Ltr": return "ltr";
            case "Rtl": return "Rtl";}
         _U.badCase($moduleName,
         "between lines 137 and 142");
      }();
   };
   var direction = F2(function (d,
   styles) {
      return A3($Css.style,
      "direction",
      directionString(d),
      styles);
   });
   var PreWrap = {ctor: "PreWrap"};
   var PreLine = {ctor: "PreLine"};
   var Pre = {ctor: "Pre"};
   var NoWrap = {ctor: "NoWrap"};
   var NormalWhiteSpace = {ctor: "NormalWhiteSpace"};
   var BidiOverride = {ctor: "BidiOverride"};
   var Embed = {ctor: "Embed"};
   var NormalUnicodeBidi = {ctor: "NormalUnicodeBidi"};
   var LineThrough = {ctor: "LineThrough"};
   var Overline = {ctor: "Overline"};
   var Underline = {ctor: "Underline"};
   var NoDecoration = {ctor: "NoDecoration"};
   var Justify = {ctor: "Justify"};
   var Center = {ctor: "Center"};
   var Right = {ctor: "Right"};
   var Left = {ctor: "Left"};
   var Rtl = {ctor: "Rtl"};
   var Ltr = {ctor: "Ltr"};
   _elm.Css.Text.values = {_op: _op
                          ,Ltr: Ltr
                          ,Rtl: Rtl
                          ,Left: Left
                          ,Right: Right
                          ,Center: Center
                          ,Justify: Justify
                          ,NoDecoration: NoDecoration
                          ,Underline: Underline
                          ,Overline: Overline
                          ,LineThrough: LineThrough
                          ,NormalUnicodeBidi: NormalUnicodeBidi
                          ,Embed: Embed
                          ,BidiOverride: BidiOverride
                          ,NormalWhiteSpace: NormalWhiteSpace
                          ,NoWrap: NoWrap
                          ,Pre: Pre
                          ,PreLine: PreLine
                          ,PreWrap: PreWrap
                          ,directionString: directionString
                          ,alignString: alignString
                          ,decorationString: decorationString
                          ,unicodeBidiString: unicodeBidiString
                          ,whiteSpaceString: whiteSpaceString
                          ,color: color
                          ,direction: direction
                          ,letterSpacing: letterSpacing
                          ,lineHeight: lineHeight
                          ,align: align
                          ,decoration: decoration
                          ,indent: indent
                          ,unicodeBidi: unicodeBidi
                          ,whiteSpace: whiteSpace
                          ,wordSpacing: wordSpacing};
   return _elm.Css.Text.values;
};
Elm.DOMInterface = Elm.DOMInterface || {};
Elm.DOMInterface.make = function (_elm) {
   "use strict";
   _elm.DOMInterface = _elm.DOMInterface || {};
   if (_elm.DOMInterface.values)
   return _elm.DOMInterface.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "DOMInterface",
   $Basics = Elm.Basics.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$DOMInterface = Elm.Native.DOMInterface.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $Task = Elm.Task.make(_elm);
   var NodeUndefined = {ctor: "NodeUndefined"};
   var PositionInfo = F7(function (a,
   b,
   c,
   d,
   e,
   f,
   g) {
      return {_: {}
             ,client: e
             ,height: d
             ,left: b
             ,margin: g
             ,offset: f
             ,top: a
             ,width: c};
   });
   var scrollElementTo = $Native$DOMInterface.scrollElementTo;
   var getElementPositionInfo = $Native$DOMInterface.getElementPositionInfo;
   _elm.DOMInterface.values = {_op: _op
                              ,getElementPositionInfo: getElementPositionInfo
                              ,scrollElementTo: scrollElementTo
                              ,PositionInfo: PositionInfo
                              ,NodeUndefined: NodeUndefined};
   return _elm.DOMInterface.values;
};
Elm.Debug = Elm.Debug || {};
Elm.Debug.make = function (_elm) {
   "use strict";
   _elm.Debug = _elm.Debug || {};
   if (_elm.Debug.values)
   return _elm.Debug.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Debug",
   $Graphics$Collage = Elm.Graphics.Collage.make(_elm),
   $Native$Debug = Elm.Native.Debug.make(_elm);
   var trace = $Native$Debug.tracePath;
   var watchSummary = $Native$Debug.watchSummary;
   var watch = $Native$Debug.watch;
   var crash = $Native$Debug.crash;
   var log = $Native$Debug.log;
   _elm.Debug.values = {_op: _op
                       ,log: log
                       ,crash: crash
                       ,watch: watch
                       ,watchSummary: watchSummary
                       ,trace: trace};
   return _elm.Debug.values;
};
Elm.Dict = Elm.Dict || {};
Elm.Dict.make = function (_elm) {
   "use strict";
   _elm.Dict = _elm.Dict || {};
   if (_elm.Dict.values)
   return _elm.Dict.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Dict",
   $Basics = Elm.Basics.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Debug = Elm.Native.Debug.make(_elm),
   $String = Elm.String.make(_elm);
   var foldr = F3(function (f,
   acc,
   t) {
      return function () {
         switch (t.ctor)
         {case "RBEmpty":
            switch (t._0.ctor)
              {case "LBlack": return acc;}
              break;
            case "RBNode": return A3(foldr,
              f,
              A3(f,
              t._1,
              t._2,
              A3(foldr,f,acc,t._4)),
              t._3);}
         _U.badCase($moduleName,
         "between lines 417 and 421");
      }();
   });
   var keys = function (dict) {
      return A3(foldr,
      F3(function (key,
      value,
      keyList) {
         return A2($List._op["::"],
         key,
         keyList);
      }),
      _L.fromArray([]),
      dict);
   };
   var values = function (dict) {
      return A3(foldr,
      F3(function (key,
      value,
      valueList) {
         return A2($List._op["::"],
         value,
         valueList);
      }),
      _L.fromArray([]),
      dict);
   };
   var toList = function (dict) {
      return A3(foldr,
      F3(function (key,value,list) {
         return A2($List._op["::"],
         {ctor: "_Tuple2"
         ,_0: key
         ,_1: value},
         list);
      }),
      _L.fromArray([]),
      dict);
   };
   var foldl = F3(function (f,
   acc,
   dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBlack": return acc;}
              break;
            case "RBNode": return A3(foldl,
              f,
              A3(f,
              dict._1,
              dict._2,
              A3(foldl,f,acc,dict._3)),
              dict._4);}
         _U.badCase($moduleName,
         "between lines 406 and 410");
      }();
   });
   var isBBlack = function (dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBBlack": return true;}
              break;
            case "RBNode":
            switch (dict._0.ctor)
              {case "BBlack": return true;}
              break;}
         return false;
      }();
   };
   var showFlag = function (f) {
      return function () {
         switch (f.ctor)
         {case "Insert": return "Insert";
            case "Remove": return "Remove";
            case "Same": return "Same";}
         _U.badCase($moduleName,
         "between lines 182 and 185");
      }();
   };
   var Same = {ctor: "Same"};
   var Remove = {ctor: "Remove"};
   var Insert = {ctor: "Insert"};
   var get = F2(function (targetKey,
   dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBlack":
                 return $Maybe.Nothing;}
              break;
            case "RBNode":
            return function () {
                 var _v29 = A2($Basics.compare,
                 targetKey,
                 dict._1);
                 switch (_v29.ctor)
                 {case "EQ":
                    return $Maybe.Just(dict._2);
                    case "GT": return A2(get,
                      targetKey,
                      dict._4);
                    case "LT": return A2(get,
                      targetKey,
                      dict._3);}
                 _U.badCase($moduleName,
                 "between lines 129 and 132");
              }();}
         _U.badCase($moduleName,
         "between lines 124 and 132");
      }();
   });
   var member = F2(function (key,
   dict) {
      return function () {
         var _v30 = A2(get,key,dict);
         switch (_v30.ctor)
         {case "Just": return true;
            case "Nothing": return false;}
         _U.badCase($moduleName,
         "between lines 138 and 140");
      }();
   });
   var max = function (dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            return $Native$Debug.crash("(max Empty) is not defined");
            case "RBNode":
            switch (dict._4.ctor)
              {case "RBEmpty":
                 return {ctor: "_Tuple2"
                        ,_0: dict._1
                        ,_1: dict._2};}
              return max(dict._4);}
         _U.badCase($moduleName,
         "between lines 100 and 108");
      }();
   };
   var min = function (dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBlack":
                 return $Native$Debug.crash("(min Empty) is not defined");}
              break;
            case "RBNode":
            switch (dict._3.ctor)
              {case "RBEmpty":
                 switch (dict._3._0.ctor)
                   {case "LBlack":
                      return {ctor: "_Tuple2"
                             ,_0: dict._1
                             ,_1: dict._2};}
                   break;}
              return min(dict._3);}
         _U.badCase($moduleName,
         "between lines 87 and 95");
      }();
   };
   var RBEmpty = function (a) {
      return {ctor: "RBEmpty"
             ,_0: a};
   };
   var RBNode = F5(function (a,
   b,
   c,
   d,
   e) {
      return {ctor: "RBNode"
             ,_0: a
             ,_1: b
             ,_2: c
             ,_3: d
             ,_4: e};
   });
   var showLColor = function (color) {
      return function () {
         switch (color.ctor)
         {case "LBBlack":
            return "LBBlack";
            case "LBlack": return "LBlack";}
         _U.badCase($moduleName,
         "between lines 70 and 72");
      }();
   };
   var LBBlack = {ctor: "LBBlack"};
   var LBlack = {ctor: "LBlack"};
   var empty = RBEmpty(LBlack);
   var isEmpty = function (dict) {
      return _U.eq(dict,empty);
   };
   var map = F2(function (f,dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBlack":
                 return RBEmpty(LBlack);}
              break;
            case "RBNode": return A5(RBNode,
              dict._0,
              dict._1,
              A2(f,dict._1,dict._2),
              A2(map,f,dict._3),
              A2(map,f,dict._4));}
         _U.badCase($moduleName,
         "between lines 394 and 399");
      }();
   });
   var showNColor = function (c) {
      return function () {
         switch (c.ctor)
         {case "BBlack": return "BBlack";
            case "Black": return "Black";
            case "NBlack": return "NBlack";
            case "Red": return "Red";}
         _U.badCase($moduleName,
         "between lines 56 and 60");
      }();
   };
   var reportRemBug = F4(function (msg,
   c,
   lgot,
   rgot) {
      return $Native$Debug.crash($String.concat(_L.fromArray(["Internal red-black tree invariant violated, expected "
                                                             ,msg
                                                             ," and got "
                                                             ,showNColor(c)
                                                             ,"/"
                                                             ,lgot
                                                             ,"/"
                                                             ,rgot
                                                             ,"\nPlease report this bug to <https://github.com/elm-lang/Elm/issues>"])));
   });
   var NBlack = {ctor: "NBlack"};
   var BBlack = {ctor: "BBlack"};
   var Black = {ctor: "Black"};
   var ensureBlackRoot = function (dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBlack": return dict;}
              break;
            case "RBNode":
            switch (dict._0.ctor)
              {case "Black": return dict;
                 case "Red": return A5(RBNode,
                   Black,
                   dict._1,
                   dict._2,
                   dict._3,
                   dict._4);}
              break;}
         _U.badCase($moduleName,
         "between lines 154 and 162");
      }();
   };
   var blackish = function (t) {
      return function () {
         switch (t.ctor)
         {case "RBEmpty": return true;
            case "RBNode":
            return _U.eq(t._0,
              Black) || _U.eq(t._0,BBlack);}
         _U.badCase($moduleName,
         "between lines 339 and 341");
      }();
   };
   var blacken = function (t) {
      return function () {
         switch (t.ctor)
         {case "RBEmpty":
            return RBEmpty(LBlack);
            case "RBNode": return A5(RBNode,
              Black,
              t._1,
              t._2,
              t._3,
              t._4);}
         _U.badCase($moduleName,
         "between lines 378 and 380");
      }();
   };
   var Red = {ctor: "Red"};
   var moreBlack = function (color) {
      return function () {
         switch (color.ctor)
         {case "BBlack":
            return $Native$Debug.crash("Can\'t make a double black node more black!");
            case "Black": return BBlack;
            case "NBlack": return Red;
            case "Red": return Black;}
         _U.badCase($moduleName,
         "between lines 244 and 248");
      }();
   };
   var lessBlack = function (color) {
      return function () {
         switch (color.ctor)
         {case "BBlack": return Black;
            case "Black": return Red;
            case "NBlack":
            return $Native$Debug.crash("Can\'t make a negative black node less black!");
            case "Red": return NBlack;}
         _U.badCase($moduleName,
         "between lines 253 and 257");
      }();
   };
   var lessBlackTree = function (dict) {
      return function () {
         switch (dict.ctor)
         {case "RBEmpty":
            switch (dict._0.ctor)
              {case "LBBlack":
                 return RBEmpty(LBlack);}
              break;
            case "RBNode": return A5(RBNode,
              lessBlack(dict._0),
              dict._1,
              dict._2,
              dict._3,
              dict._4);}
         _U.badCase($moduleName,
         "between lines 262 and 264");
      }();
   };
   var redden = function (t) {
      return function () {
         switch (t.ctor)
         {case "RBEmpty":
            return $Native$Debug.crash("can\'t make a Leaf red");
            case "RBNode": return A5(RBNode,
              Red,
              t._1,
              t._2,
              t._3,
              t._4);}
         _U.badCase($moduleName,
         "between lines 386 and 388");
      }();
   };
   var balance_node = function (t) {
      return function () {
         var assemble = function (col) {
            return function (xk) {
               return function (xv) {
                  return function (yk) {
                     return function (yv) {
                        return function (zk) {
                           return function (zv) {
                              return function (a) {
                                 return function (b) {
                                    return function (c) {
                                       return function (d) {
                                          return A5(RBNode,
                                          lessBlack(col),
                                          yk,
                                          yv,
                                          A5(RBNode,Black,xk,xv,a,b),
                                          A5(RBNode,Black,zk,zv,c,d));
                                       };
                                    };
                                 };
                              };
                           };
                        };
                     };
                  };
               };
            };
         };
         return blackish(t) ? function () {
            switch (t.ctor)
            {case "RBNode":
               switch (t._3.ctor)
                 {case "RBNode":
                    switch (t._3._0.ctor)
                      {case "Red":
                         switch (t._3._3.ctor)
                           {case "RBNode":
                              switch (t._3._3._0.ctor)
                                {case "Red":
                                   return assemble(t._0)(t._3._3._1)(t._3._3._2)(t._3._1)(t._3._2)(t._1)(t._2)(t._3._3._3)(t._3._3._4)(t._3._4)(t._4);}
                                break;}
                           switch (t._3._4.ctor)
                           {case "RBNode":
                              switch (t._3._4._0.ctor)
                                {case "Red":
                                   return assemble(t._0)(t._3._1)(t._3._2)(t._3._4._1)(t._3._4._2)(t._1)(t._2)(t._3._3)(t._3._4._3)(t._3._4._4)(t._4);}
                                break;}
                           break;}
                      break;}
                 switch (t._4.ctor)
                 {case "RBNode":
                    switch (t._4._0.ctor)
                      {case "Red":
                         switch (t._4._3.ctor)
                           {case "RBNode":
                              switch (t._4._3._0.ctor)
                                {case "Red":
                                   return assemble(t._0)(t._1)(t._2)(t._4._3._1)(t._4._3._2)(t._4._1)(t._4._2)(t._3)(t._4._3._3)(t._4._3._4)(t._4._4);}
                                break;}
                           switch (t._4._4.ctor)
                           {case "RBNode":
                              switch (t._4._4._0.ctor)
                                {case "Red":
                                   return assemble(t._0)(t._1)(t._2)(t._4._1)(t._4._2)(t._4._4._1)(t._4._4._2)(t._3)(t._4._3)(t._4._4._3)(t._4._4._4);}
                                break;}
                           break;}
                      break;}
                 switch (t._0.ctor)
                 {case "BBlack":
                    switch (t._4.ctor)
                      {case "RBNode":
                         switch (t._4._0.ctor)
                           {case "NBlack":
                              switch (t._4._3.ctor)
                                {case "RBNode":
                                   switch (t._4._3._0.ctor)
                                     {case "Black":
                                        return function () {
                                             switch (t._4._4.ctor)
                                             {case "RBNode":
                                                switch (t._4._4._0.ctor)
                                                  {case "Black":
                                                     return A5(RBNode,
                                                       Black,
                                                       t._4._3._1,
                                                       t._4._3._2,
                                                       A5(RBNode,
                                                       Black,
                                                       t._1,
                                                       t._2,
                                                       t._3,
                                                       t._4._3._3),
                                                       A5(balance,
                                                       Black,
                                                       t._4._1,
                                                       t._4._2,
                                                       t._4._3._4,
                                                       redden(t._4._4)));}
                                                  break;}
                                             return t;
                                          }();}
                                     break;}
                                break;}
                           break;}
                      switch (t._3.ctor)
                      {case "RBNode":
                         switch (t._3._0.ctor)
                           {case "NBlack":
                              switch (t._3._4.ctor)
                                {case "RBNode":
                                   switch (t._3._4._0.ctor)
                                     {case "Black":
                                        return function () {
                                             switch (t._3._3.ctor)
                                             {case "RBNode":
                                                switch (t._3._3._0.ctor)
                                                  {case "Black":
                                                     return A5(RBNode,
                                                       Black,
                                                       t._3._4._1,
                                                       t._3._4._2,
                                                       A5(balance,
                                                       Black,
                                                       t._3._1,
                                                       t._3._2,
                                                       redden(t._3._3),
                                                       t._3._4._3),
                                                       A5(RBNode,
                                                       Black,
                                                       t._1,
                                                       t._2,
                                                       t._3._4._4,
                                                       t._4));}
                                                  break;}
                                             return t;
                                          }();}
                                     break;}
                                break;}
                           break;}
                      break;}
                 break;}
            return t;
         }() : t;
      }();
   };
   var balance = F5(function (c,
   k,
   v,
   l,
   r) {
      return balance_node(A5(RBNode,
      c,
      k,
      v,
      l,
      r));
   });
   var bubble = F5(function (c,
   k,
   v,
   l,
   r) {
      return isBBlack(l) || isBBlack(r) ? A5(balance,
      moreBlack(c),
      k,
      v,
      lessBlackTree(l),
      lessBlackTree(r)) : A5(RBNode,
      c,
      k,
      v,
      l,
      r);
   });
   var remove_max = F5(function (c,
   k,
   v,
   l,
   r) {
      return function () {
         switch (r.ctor)
         {case "RBEmpty": return A3(rem,
              c,
              l,
              r);
            case "RBNode": return A5(bubble,
              c,
              k,
              v,
              l,
              A5(remove_max,
              r._0,
              r._1,
              r._2,
              r._3,
              r._4));}
         _U.badCase($moduleName,
         "between lines 323 and 328");
      }();
   });
   var rem = F3(function (c,l,r) {
      return function () {
         var _v169 = {ctor: "_Tuple2"
                     ,_0: l
                     ,_1: r};
         switch (_v169.ctor)
         {case "_Tuple2":
            switch (_v169._0.ctor)
              {case "RBEmpty":
                 switch (_v169._1.ctor)
                   {case "RBEmpty":
                      return function () {
                           switch (c.ctor)
                           {case "Black":
                              return RBEmpty(LBBlack);
                              case "Red":
                              return RBEmpty(LBlack);}
                           _U.badCase($moduleName,
                           "between lines 282 and 286");
                        }();
                      case "RBNode":
                      return function () {
                           var _v191 = {ctor: "_Tuple3"
                                       ,_0: c
                                       ,_1: _v169._0._0
                                       ,_2: _v169._1._0};
                           switch (_v191.ctor)
                           {case "_Tuple3":
                              switch (_v191._0.ctor)
                                {case "Black":
                                   switch (_v191._1.ctor)
                                     {case "LBlack":
                                        switch (_v191._2.ctor)
                                          {case "Red": return A5(RBNode,
                                               Black,
                                               _v169._1._1,
                                               _v169._1._2,
                                               _v169._1._3,
                                               _v169._1._4);}
                                          break;}
                                     break;}
                                break;}
                           return A4(reportRemBug,
                           "Black/LBlack/Red",
                           c,
                           showLColor(_v169._0._0),
                           showNColor(_v169._1._0));
                        }();}
                   break;
                 case "RBNode":
                 switch (_v169._1.ctor)
                   {case "RBEmpty":
                      return function () {
                           var _v195 = {ctor: "_Tuple3"
                                       ,_0: c
                                       ,_1: _v169._0._0
                                       ,_2: _v169._1._0};
                           switch (_v195.ctor)
                           {case "_Tuple3":
                              switch (_v195._0.ctor)
                                {case "Black":
                                   switch (_v195._1.ctor)
                                     {case "Red":
                                        switch (_v195._2.ctor)
                                          {case "LBlack":
                                             return A5(RBNode,
                                               Black,
                                               _v169._0._1,
                                               _v169._0._2,
                                               _v169._0._3,
                                               _v169._0._4);}
                                          break;}
                                     break;}
                                break;}
                           return A4(reportRemBug,
                           "Black/Red/LBlack",
                           c,
                           showNColor(_v169._0._0),
                           showLColor(_v169._1._0));
                        }();
                      case "RBNode":
                      return function () {
                           var l$ = A5(remove_max,
                           _v169._0._0,
                           _v169._0._1,
                           _v169._0._2,
                           _v169._0._3,
                           _v169._0._4);
                           var r = A5(RBNode,
                           _v169._1._0,
                           _v169._1._1,
                           _v169._1._2,
                           _v169._1._3,
                           _v169._1._4);
                           var l = A5(RBNode,
                           _v169._0._0,
                           _v169._0._1,
                           _v169._0._2,
                           _v169._0._3,
                           _v169._0._4);
                           var $ = max(l),
                           k = $._0,
                           v = $._1;
                           return A5(bubble,c,k,v,l$,r);
                        }();}
                   break;}
              break;}
         _U.badCase($moduleName,
         "between lines 280 and 309");
      }();
   });
   var update = F3(function (k,
   alter,
   dict) {
      return function () {
         var up = function (dict) {
            return function () {
               switch (dict.ctor)
               {case "RBEmpty":
                  switch (dict._0.ctor)
                    {case "LBlack":
                       return function () {
                            var _v206 = alter($Maybe.Nothing);
                            switch (_v206.ctor)
                            {case "Just":
                               return {ctor: "_Tuple2"
                                      ,_0: Insert
                                      ,_1: A5(RBNode,
                                      Red,
                                      k,
                                      _v206._0,
                                      empty,
                                      empty)};
                               case "Nothing":
                               return {ctor: "_Tuple2"
                                      ,_0: Same
                                      ,_1: empty};}
                            _U.badCase($moduleName,
                            "between lines 194 and 198");
                         }();}
                    break;
                  case "RBNode":
                  return function () {
                       var _v208 = A2($Basics.compare,
                       k,
                       dict._1);
                       switch (_v208.ctor)
                       {case "EQ": return function () {
                               var _v209 = alter($Maybe.Just(dict._2));
                               switch (_v209.ctor)
                               {case "Just":
                                  return {ctor: "_Tuple2"
                                         ,_0: Same
                                         ,_1: A5(RBNode,
                                         dict._0,
                                         dict._1,
                                         _v209._0,
                                         dict._3,
                                         dict._4)};
                                  case "Nothing":
                                  return {ctor: "_Tuple2"
                                         ,_0: Remove
                                         ,_1: A3(rem,
                                         dict._0,
                                         dict._3,
                                         dict._4)};}
                               _U.badCase($moduleName,
                               "between lines 201 and 206");
                            }();
                          case "GT": return function () {
                               var $ = up(dict._4),
                               flag = $._0,
                               newRight = $._1;
                               return function () {
                                  switch (flag.ctor)
                                  {case "Insert":
                                     return {ctor: "_Tuple2"
                                            ,_0: Insert
                                            ,_1: A5(balance,
                                            dict._0,
                                            dict._1,
                                            dict._2,
                                            dict._3,
                                            newRight)};
                                     case "Remove":
                                     return {ctor: "_Tuple2"
                                            ,_0: Remove
                                            ,_1: A5(bubble,
                                            dict._0,
                                            dict._1,
                                            dict._2,
                                            dict._3,
                                            newRight)};
                                     case "Same":
                                     return {ctor: "_Tuple2"
                                            ,_0: Same
                                            ,_1: A5(RBNode,
                                            dict._0,
                                            dict._1,
                                            dict._2,
                                            dict._3,
                                            newRight)};}
                                  _U.badCase($moduleName,
                                  "between lines 215 and 220");
                               }();
                            }();
                          case "LT": return function () {
                               var $ = up(dict._3),
                               flag = $._0,
                               newLeft = $._1;
                               return function () {
                                  switch (flag.ctor)
                                  {case "Insert":
                                     return {ctor: "_Tuple2"
                                            ,_0: Insert
                                            ,_1: A5(balance,
                                            dict._0,
                                            dict._1,
                                            dict._2,
                                            newLeft,
                                            dict._4)};
                                     case "Remove":
                                     return {ctor: "_Tuple2"
                                            ,_0: Remove
                                            ,_1: A5(bubble,
                                            dict._0,
                                            dict._1,
                                            dict._2,
                                            newLeft,
                                            dict._4)};
                                     case "Same":
                                     return {ctor: "_Tuple2"
                                            ,_0: Same
                                            ,_1: A5(RBNode,
                                            dict._0,
                                            dict._1,
                                            dict._2,
                                            newLeft,
                                            dict._4)};}
                                  _U.badCase($moduleName,
                                  "between lines 208 and 213");
                               }();
                            }();}
                       _U.badCase($moduleName,
                       "between lines 199 and 220");
                    }();}
               _U.badCase($moduleName,
               "between lines 192 and 220");
            }();
         };
         var $ = up(dict),
         flag = $._0,
         updatedDict = $._1;
         return function () {
            switch (flag.ctor)
            {case "Insert":
               return ensureBlackRoot(updatedDict);
               case "Remove":
               return blacken(updatedDict);
               case "Same":
               return updatedDict;}
            _U.badCase($moduleName,
            "between lines 222 and 225");
         }();
      }();
   });
   var insert = F3(function (key,
   value,
   dict) {
      return A3(update,
      key,
      $Basics.always($Maybe.Just(value)),
      dict);
   });
   var singleton = F2(function (key,
   value) {
      return A3(insert,
      key,
      value,
      empty);
   });
   var union = F2(function (t1,
   t2) {
      return A3(foldl,
      insert,
      t2,
      t1);
   });
   var fromList = function (assocs) {
      return A3($List.foldl,
      F2(function (_v214,dict) {
         return function () {
            switch (_v214.ctor)
            {case "_Tuple2":
               return A3(insert,
                 _v214._0,
                 _v214._1,
                 dict);}
            _U.badCase($moduleName,
            "on line 466, column 38 to 59");
         }();
      }),
      empty,
      assocs);
   };
   var filter = F2(function (predicate,
   dictionary) {
      return function () {
         var add = F3(function (key,
         value,
         dict) {
            return A2(predicate,
            key,
            value) ? A3(insert,
            key,
            value,
            dict) : dict;
         });
         return A3(foldl,
         add,
         empty,
         dictionary);
      }();
   });
   var intersect = F2(function (t1,
   t2) {
      return A2(filter,
      F2(function (k,_v218) {
         return function () {
            return A2(member,k,t2);
         }();
      }),
      t1);
   });
   var partition = F2(function (predicate,
   dict) {
      return function () {
         var add = F3(function (key,
         value,
         _v220) {
            return function () {
               switch (_v220.ctor)
               {case "_Tuple2":
                  return A2(predicate,
                    key,
                    value) ? {ctor: "_Tuple2"
                             ,_0: A3(insert,
                             key,
                             value,
                             _v220._0)
                             ,_1: _v220._1} : {ctor: "_Tuple2"
                                              ,_0: _v220._0
                                              ,_1: A3(insert,
                                              key,
                                              value,
                                              _v220._1)};}
               _U.badCase($moduleName,
               "between lines 487 and 489");
            }();
         });
         return A3(foldl,
         add,
         {ctor: "_Tuple2"
         ,_0: empty
         ,_1: empty},
         dict);
      }();
   });
   var remove = F2(function (key,
   dict) {
      return A3(update,
      key,
      $Basics.always($Maybe.Nothing),
      dict);
   });
   var diff = F2(function (t1,t2) {
      return A3(foldl,
      F3(function (k,v,t) {
         return A2(remove,k,t);
      }),
      t1,
      t2);
   });
   _elm.Dict.values = {_op: _op
                      ,empty: empty
                      ,singleton: singleton
                      ,insert: insert
                      ,update: update
                      ,isEmpty: isEmpty
                      ,get: get
                      ,remove: remove
                      ,member: member
                      ,filter: filter
                      ,partition: partition
                      ,foldl: foldl
                      ,foldr: foldr
                      ,map: map
                      ,union: union
                      ,intersect: intersect
                      ,diff: diff
                      ,keys: keys
                      ,values: values
                      ,toList: toList
                      ,fromList: fromList};
   return _elm.Dict.values;
};
Elm.Easing = Elm.Easing || {};
Elm.Easing.make = function (_elm) {
   "use strict";
   _elm.Easing = _elm.Easing || {};
   if (_elm.Easing.values)
   return _elm.Easing.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Easing",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $Time = Elm.Time.make(_elm);
   var cycle = F3(function (animation,
   d,
   t) {
      return A2(animation,
      1,
      t / d - $Basics.toFloat($Basics.floor(t / d)));
   });
   var flip = F2(function (easing,
   time) {
      return easing(1 - time);
   });
   var retour = F2(function (easing,
   time) {
      return _U.cmp(time,
      0.5) < 0 ? easing(time * 2) : flip(easing)((time - 0.5) * 2);
   });
   var invert = F2(function (easing,
   time) {
      return 1 - easing(1 - time);
   });
   var inOut = F3(function (e1,
   e2,
   time) {
      return _U.cmp(time,
      0.5) < 0 ? e1(time * 2) / 2 : 0.5 + e2((time - 0.5) * 2) / 2;
   });
   var easeInElastic = function (time) {
      return function () {
         var t$ = time - 1;
         var p = 0.3;
         var s = 7.5e-2;
         return 0 - Math.pow(2,
         10 * t$) * $Basics.sin((t$ - s) * (2 * $Basics.pi) / p);
      }();
   };
   var easeOutElastic = invert(easeInElastic);
   var easeInOutElastic = A2(inOut,
   easeInElastic,
   easeOutElastic);
   var easeOutBounce = function (time) {
      return function () {
         var t4 = time - 2.65 / 2.75;
         var t3 = time - 2.25 / 2.75;
         var t2 = time - 1.5 / 2.75;
         var a = 7.5625;
         return _U.cmp(time,
         1 / 2.75) < 0 ? a * time * time : _U.cmp(time,
         2 / 2.75) < 0 ? a * t2 * t2 + 0.75 : _U.cmp(time,
         2.5 / 2.75) < 0 ? a * t3 * t3 + 0.9375 : a * t4 * t4 + 0.984375;
      }();
   };
   var easeInBounce = invert(easeOutBounce);
   var easeInOutBounce = A2(inOut,
   easeInBounce,
   easeOutBounce);
   var easeInBack = function (time) {
      return time * time * (2.70158 * time - 1.70158);
   };
   var easeOutBack = invert(easeInBack);
   var easeInOutBack = A2(inOut,
   easeInBack,
   easeOutBack);
   var easeOutCirc = function (time) {
      return $Basics.sqrt(1 - Math.pow(time - 1,
      2));
   };
   var easeInCirc = invert(easeOutCirc);
   var easeInOutCirc = A2(inOut,
   easeInCirc,
   easeOutCirc);
   var easeInExpo = function (time) {
      return Math.pow(2,
      10 * (time - 1));
   };
   var easeOutExpo = invert(easeInExpo);
   var easeInOutExpo = A2(inOut,
   easeInExpo,
   easeOutExpo);
   var easeOutSine = function (time) {
      return $Basics.sin(time * ($Basics.pi / 2));
   };
   var easeInSine = invert(easeOutSine);
   var easeInOutSine = A2(inOut,
   easeInSine,
   easeOutSine);
   var easeInQuint = function (time) {
      return Math.pow(time,5);
   };
   var easeOutQuint = invert(easeInQuint);
   var easeInOutQuint = A2(inOut,
   easeInQuint,
   easeOutQuint);
   var easeInQuart = function (time) {
      return Math.pow(time,4);
   };
   var easeOutQuart = invert(easeInQuart);
   var easeInOutQuart = A2(inOut,
   easeInQuart,
   easeOutQuart);
   var easeInCubic = function (time) {
      return Math.pow(time,3);
   };
   var easeOutCubic = invert(easeInCubic);
   var easeInOutCubic = A2(inOut,
   easeInCubic,
   easeOutCubic);
   var easeInQuad = function (time) {
      return Math.pow(time,2);
   };
   var easeOutQuad = invert(easeInQuad);
   var easeInOutQuad = A2(inOut,
   easeInQuad,
   easeOutQuad);
   var linear = $Basics.identity;
   var pair = F4(function (interpolate,
   _v0,
   _v1,
   v) {
      return function () {
         switch (_v1.ctor)
         {case "_Tuple2":
            return function () {
                 switch (_v0.ctor)
                 {case "_Tuple2":
                    return {ctor: "_Tuple2"
                           ,_0: A3(interpolate,
                           _v0._0,
                           _v1._0,
                           v)
                           ,_1: A3(interpolate,
                           _v0._1,
                           _v1._1,
                           v)};}
                 _U.badCase($moduleName,
                 "on line 150, column 6 to 46");
              }();}
         _U.badCase($moduleName,
         "on line 150, column 6 to 46");
      }();
   });
   var $float = F3(function (from,
   to,
   v) {
      return from + (to - from) * v;
   });
   var point2d = F3(function (from,
   to,
   v) {
      return {_: {}
             ,x: A3($float,from.x,to.x,v)
             ,y: A3($float,from.y,to.y,v)};
   });
   var point3d = F3(function (from,
   to,
   v) {
      return {_: {}
             ,x: A3($float,from.x,to.x,v)
             ,y: A3($float,from.y,to.y,v)
             ,z: A3($float,from.z,to.z,v)};
   });
   var color = F3(function (from,
   to,
   v) {
      return function () {
         var float$ = F3(function (from,
         to,
         v) {
            return $Basics.round(A3($float,
            $Basics.toFloat(from),
            $Basics.toFloat(to),
            v));
         });
         var $ = {ctor: "_Tuple2"
                 ,_0: $Color.toRgb(from)
                 ,_1: $Color.toRgb(to)},
         rgb1 = $._0,
         rgb2 = $._1;
         var $ = {ctor: "_Tuple4"
                 ,_0: rgb1.red
                 ,_1: rgb1.green
                 ,_2: rgb1.blue
                 ,_3: rgb1.alpha},
         r1 = $._0,
         g1 = $._1,
         b1 = $._2,
         a1 = $._3;
         var $ = {ctor: "_Tuple4"
                 ,_0: rgb2.red
                 ,_1: rgb2.green
                 ,_2: rgb2.blue
                 ,_3: rgb2.alpha},
         r2 = $._0,
         g2 = $._1,
         b2 = $._2,
         a2 = $._3;
         return A4($Color.rgba,
         A3(float$,r1,r2,v),
         A3(float$,g1,g2,v),
         A3(float$,b1,b2,v),
         A3($float,a1,a2,v));
      }();
   });
   var bezier = F5(function (x1,
   y1,
   x2,
   y2,
   time) {
      return function () {
         var casteljau = function (ps) {
            return function () {
               switch (ps.ctor)
               {case "::": switch (ps._0.ctor)
                    {case "_Tuple2":
                       switch (ps._1.ctor)
                         {case "[]": return ps._0._1;}
                         break;}
                    break;}
               return casteljau(A3($List.map2,
               F2(function (x,y) {
                  return A4(pair,
                  $float,
                  x,
                  y,
                  time);
               }),
               ps,
               A2($Maybe.withDefault,
               _L.fromArray([]),
               $List.tail(ps))));
            }();
         };
         return casteljau(_L.fromArray([{ctor: "_Tuple2"
                                        ,_0: 0
                                        ,_1: 0}
                                       ,{ctor: "_Tuple2",_0: x1,_1: y1}
                                       ,{ctor: "_Tuple2",_0: x2,_1: y2}
                                       ,{ctor: "_Tuple2"
                                        ,_0: 1
                                        ,_1: 1}]));
      }();
   });
   var ease = F6(function (easing,
   interpolation,
   from,
   to,
   duration,
   time) {
      return A3(interpolation,
      from,
      to,
      easing(A2($Basics.min,
      time / duration,
      1)));
   });
   _elm.Easing.values = {_op: _op
                        ,ease: ease
                        ,$float: $float
                        ,point2d: point2d
                        ,point3d: point3d
                        ,color: color
                        ,pair: pair
                        ,cycle: cycle
                        ,invert: invert
                        ,retour: retour
                        ,inOut: inOut
                        ,flip: flip
                        ,bezier: bezier
                        ,linear: linear
                        ,easeInQuad: easeInQuad
                        ,easeOutQuad: easeOutQuad
                        ,easeInOutQuad: easeInOutQuad
                        ,easeInCubic: easeInCubic
                        ,easeOutCubic: easeOutCubic
                        ,easeInOutCubic: easeInOutCubic
                        ,easeInQuart: easeInQuart
                        ,easeOutQuart: easeOutQuart
                        ,easeInOutQuart: easeInOutQuart
                        ,easeInQuint: easeInQuint
                        ,easeOutQuint: easeOutQuint
                        ,easeInOutQuint: easeInOutQuint
                        ,easeInSine: easeInSine
                        ,easeOutSine: easeOutSine
                        ,easeInOutSine: easeInOutSine
                        ,easeInExpo: easeInExpo
                        ,easeOutExpo: easeOutExpo
                        ,easeInOutExpo: easeInOutExpo
                        ,easeInCirc: easeInCirc
                        ,easeOutCirc: easeOutCirc
                        ,easeInOutCirc: easeInOutCirc
                        ,easeInBack: easeInBack
                        ,easeOutBack: easeOutBack
                        ,easeInOutBack: easeInOutBack
                        ,easeInBounce: easeInBounce
                        ,easeOutBounce: easeOutBounce
                        ,easeInOutBounce: easeInOutBounce
                        ,easeInElastic: easeInElastic
                        ,easeOutElastic: easeOutElastic
                        ,easeInOutElastic: easeInOutElastic};
   return _elm.Easing.values;
};
Elm.Effects = Elm.Effects || {};
Elm.Effects.make = function (_elm) {
   "use strict";
   _elm.Effects = _elm.Effects || {};
   if (_elm.Effects.values)
   return _elm.Effects.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Effects",
   $Basics = Elm.Basics.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Effects = Elm.Native.Effects.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $Task = Elm.Task.make(_elm),
   $Time = Elm.Time.make(_elm);
   var ignore = function (task) {
      return A2($Task.map,
      $Basics.always({ctor: "_Tuple0"}),
      task);
   };
   var requestTickSending = $Native$Effects.requestTickSending;
   var toTaskHelp = F3(function (address,
   effect,
   _v0) {
      return function () {
         switch (_v0.ctor)
         {case "_Tuple2":
            return function () {
                 switch (effect.ctor)
                 {case "Batch":
                    return A3($List.foldl,
                      toTaskHelp(address),
                      _v0,
                      effect._0);
                    case "None": return _v0;
                    case "Task":
                    return function () {
                         var reporter = A2($Task.andThen,
                         effect._0,
                         function (answer) {
                            return A2($Signal.send,
                            address,
                            _L.fromArray([answer]));
                         });
                         return {ctor: "_Tuple2"
                                ,_0: A2($Task.andThen,
                                _v0._0,
                                $Basics.always(ignore($Task.spawn(reporter))))
                                ,_1: _v0._1};
                      }();
                    case "Tick":
                    return {ctor: "_Tuple2"
                           ,_0: _v0._0
                           ,_1: A2($List._op["::"],
                           effect._0,
                           _v0._1)};}
                 _U.badCase($moduleName,
                 "between lines 181 and 200");
              }();}
         _U.badCase($moduleName,
         "between lines 181 and 200");
      }();
   });
   var toTask = F2(function (address,
   effect) {
      return function () {
         var $ = A3(toTaskHelp,
         address,
         effect,
         {ctor: "_Tuple2"
         ,_0: $Task.succeed({ctor: "_Tuple0"})
         ,_1: _L.fromArray([])}),
         combinedTask = $._0,
         tickMessages = $._1;
         return $List.isEmpty(tickMessages) ? combinedTask : A2($Task.andThen,
         combinedTask,
         $Basics.always(A2(requestTickSending,
         address,
         tickMessages)));
      }();
   });
   var Never = function (a) {
      return {ctor: "Never",_0: a};
   };
   var Batch = function (a) {
      return {ctor: "Batch",_0: a};
   };
   var batch = Batch;
   var None = {ctor: "None"};
   var none = None;
   var Tick = function (a) {
      return {ctor: "Tick",_0: a};
   };
   var tick = Tick;
   var Task = function (a) {
      return {ctor: "Task",_0: a};
   };
   var task = Task;
   var map = F2(function (func,
   effect) {
      return function () {
         switch (effect.ctor)
         {case "Batch":
            return Batch(A2($List.map,
              map(func),
              effect._0));
            case "None": return None;
            case "Task":
            return Task(A2($Task.map,
              func,
              effect._0));
            case "Tick":
            return Tick(function ($) {
                 return func(effect._0($));
              });}
         _U.badCase($moduleName,
         "between lines 136 and 147");
      }();
   });
   _elm.Effects.values = {_op: _op
                         ,none: none
                         ,task: task
                         ,tick: tick
                         ,map: map
                         ,batch: batch
                         ,toTask: toTask};
   return _elm.Effects.values;
};
Elm.Either = Elm.Either || {};
Elm.Either.make = function (_elm) {
   "use strict";
   _elm.Either = _elm.Either || {};
   if (_elm.Either.values)
   return _elm.Either.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Either",
   $Basics = Elm.Basics.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var isRight = function (ex) {
      return function () {
         switch (ex.ctor)
         {case "Right": return true;}
         return false;
      }();
   };
   var isLeft = function (ex) {
      return function () {
         switch (ex.ctor)
         {case "Left": return true;}
         return false;
      }();
   };
   var elim = F3(function (f,
   g,
   ex) {
      return function () {
         switch (ex.ctor)
         {case "Left": return f(ex._0);
            case "Right": return g(ex._0);}
         _U.badCase($moduleName,
         "between lines 35 and 37");
      }();
   });
   var Right = function (a) {
      return {ctor: "Right",_0: a};
   };
   var Left = function (a) {
      return {ctor: "Left",_0: a};
   };
   var mapRight = F2(function (f,
   ex) {
      return function () {
         switch (ex.ctor)
         {case "Left":
            return Left(ex._0);
            case "Right":
            return Right(f(ex._0));}
         _U.badCase($moduleName,
         "between lines 20 and 22");
      }();
   });
   var mapLeft = F2(function (f,
   ex) {
      return function () {
         switch (ex.ctor)
         {case "Left":
            return Left(f(ex._0));
            case "Right":
            return Right(ex._0);}
         _U.badCase($moduleName,
         "between lines 25 and 27");
      }();
   });
   var mapBoth = F3(function (f,
   g,
   ex) {
      return function () {
         switch (ex.ctor)
         {case "Left":
            return Left(f(ex._0));
            case "Right":
            return Right(g(ex._0));}
         _U.badCase($moduleName,
         "between lines 30 and 32");
      }();
   });
   _elm.Either.values = {_op: _op
                        ,Left: Left
                        ,Right: Right
                        ,mapRight: mapRight
                        ,mapLeft: mapLeft
                        ,mapBoth: mapBoth
                        ,elim: elim
                        ,isLeft: isLeft
                        ,isRight: isRight};
   return _elm.Either.values;
};
Elm.Graphics = Elm.Graphics || {};
Elm.Graphics.Collage = Elm.Graphics.Collage || {};
Elm.Graphics.Collage.make = function (_elm) {
   "use strict";
   _elm.Graphics = _elm.Graphics || {};
   _elm.Graphics.Collage = _elm.Graphics.Collage || {};
   if (_elm.Graphics.Collage.values)
   return _elm.Graphics.Collage.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Graphics.Collage",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $Graphics$Element = Elm.Graphics.Element.make(_elm),
   $List = Elm.List.make(_elm),
   $Native$Graphics$Collage = Elm.Native.Graphics.Collage.make(_elm),
   $Text = Elm.Text.make(_elm),
   $Transform2D = Elm.Transform2D.make(_elm);
   var ngon = F2(function (n,r) {
      return function () {
         var m = $Basics.toFloat(n);
         var t = 2 * $Basics.pi / m;
         var f = function (i) {
            return {ctor: "_Tuple2"
                   ,_0: r * $Basics.cos(t * i)
                   ,_1: r * $Basics.sin(t * i)};
         };
         return A2($List.map,
         f,
         _L.range(0,m - 1));
      }();
   });
   var oval = F2(function (w,h) {
      return function () {
         var hh = h / 2;
         var hw = w / 2;
         var n = 50;
         var t = 2 * $Basics.pi / n;
         var f = function (i) {
            return {ctor: "_Tuple2"
                   ,_0: hw * $Basics.cos(t * i)
                   ,_1: hh * $Basics.sin(t * i)};
         };
         return A2($List.map,
         f,
         _L.range(0,n - 1));
      }();
   });
   var circle = function (r) {
      return A2(oval,2 * r,2 * r);
   };
   var rect = F2(function (w,h) {
      return function () {
         var hh = h / 2;
         var hw = w / 2;
         return _L.fromArray([{ctor: "_Tuple2"
                              ,_0: 0 - hw
                              ,_1: 0 - hh}
                             ,{ctor: "_Tuple2"
                              ,_0: 0 - hw
                              ,_1: hh}
                             ,{ctor: "_Tuple2",_0: hw,_1: hh}
                             ,{ctor: "_Tuple2"
                              ,_0: hw
                              ,_1: 0 - hh}]);
      }();
   });
   var square = function (n) {
      return A2(rect,n,n);
   };
   var polygon = function (points) {
      return points;
   };
   var segment = F2(function (p1,
   p2) {
      return _L.fromArray([p1,p2]);
   });
   var path = function (ps) {
      return ps;
   };
   var collage = $Native$Graphics$Collage.collage;
   var alpha = F2(function (a,f) {
      return _U.replace([["alpha"
                         ,a]],
      f);
   });
   var rotate = F2(function (t,f) {
      return _U.replace([["theta"
                         ,f.theta + t]],
      f);
   });
   var scale = F2(function (s,f) {
      return _U.replace([["scale"
                         ,f.scale * s]],
      f);
   });
   var moveY = F2(function (y,f) {
      return _U.replace([["y"
                         ,f.y + y]],
      f);
   });
   var moveX = F2(function (x,f) {
      return _U.replace([["x"
                         ,f.x + x]],
      f);
   });
   var move = F2(function (_v0,f) {
      return function () {
         switch (_v0.ctor)
         {case "_Tuple2":
            return _U.replace([["x"
                               ,f.x + _v0._0]
                              ,["y",f.y + _v0._1]],
              f);}
         _U.badCase($moduleName,
         "on line 226, column 3 to 37");
      }();
   });
   var form = function (f) {
      return {_: {}
             ,alpha: 1
             ,form: f
             ,scale: 1
             ,theta: 0
             ,x: 0
             ,y: 0};
   };
   var Fill = function (a) {
      return {ctor: "Fill",_0: a};
   };
   var Line = function (a) {
      return {ctor: "Line",_0: a};
   };
   var FGroup = F2(function (a,b) {
      return {ctor: "FGroup"
             ,_0: a
             ,_1: b};
   });
   var group = function (fs) {
      return form(A2(FGroup,
      $Transform2D.identity,
      fs));
   };
   var groupTransform = F2(function (matrix,
   fs) {
      return form(A2(FGroup,
      matrix,
      fs));
   });
   var FElement = function (a) {
      return {ctor: "FElement"
             ,_0: a};
   };
   var toForm = function (e) {
      return form(FElement(e));
   };
   var FImage = F4(function (a,
   b,
   c,
   d) {
      return {ctor: "FImage"
             ,_0: a
             ,_1: b
             ,_2: c
             ,_3: d};
   });
   var sprite = F4(function (w,
   h,
   pos,
   src) {
      return form(A4(FImage,
      w,
      h,
      pos,
      src));
   });
   var FText = function (a) {
      return {ctor: "FText",_0: a};
   };
   var text = function (t) {
      return form(FText(t));
   };
   var FOutlinedText = F2(function (a,
   b) {
      return {ctor: "FOutlinedText"
             ,_0: a
             ,_1: b};
   });
   var outlinedText = F2(function (ls,
   t) {
      return form(A2(FOutlinedText,
      ls,
      t));
   });
   var FShape = F2(function (a,b) {
      return {ctor: "FShape"
             ,_0: a
             ,_1: b};
   });
   var fill = F2(function (style,
   shape) {
      return form(A2(FShape,
      Fill(style),
      shape));
   });
   var outlined = F2(function (style,
   shape) {
      return form(A2(FShape,
      Line(style),
      shape));
   });
   var FPath = F2(function (a,b) {
      return {ctor: "FPath"
             ,_0: a
             ,_1: b};
   });
   var traced = F2(function (style,
   path) {
      return form(A2(FPath,
      style,
      path));
   });
   var LineStyle = F6(function (a,
   b,
   c,
   d,
   e,
   f) {
      return {_: {}
             ,cap: c
             ,color: a
             ,dashOffset: f
             ,dashing: e
             ,join: d
             ,width: b};
   });
   var Clipped = {ctor: "Clipped"};
   var Sharp = function (a) {
      return {ctor: "Sharp",_0: a};
   };
   var Smooth = {ctor: "Smooth"};
   var Padded = {ctor: "Padded"};
   var Round = {ctor: "Round"};
   var Flat = {ctor: "Flat"};
   var defaultLine = {_: {}
                     ,cap: Flat
                     ,color: $Color.black
                     ,dashOffset: 0
                     ,dashing: _L.fromArray([])
                     ,join: Sharp(10)
                     ,width: 1};
   var solid = function (clr) {
      return _U.replace([["color"
                         ,clr]],
      defaultLine);
   };
   var dashed = function (clr) {
      return _U.replace([["color"
                         ,clr]
                        ,["dashing"
                         ,_L.fromArray([8,4])]],
      defaultLine);
   };
   var dotted = function (clr) {
      return _U.replace([["color"
                         ,clr]
                        ,["dashing"
                         ,_L.fromArray([3,3])]],
      defaultLine);
   };
   var Grad = function (a) {
      return {ctor: "Grad",_0: a};
   };
   var gradient = F2(function (grad,
   shape) {
      return A2(fill,
      Grad(grad),
      shape);
   });
   var Texture = function (a) {
      return {ctor: "Texture"
             ,_0: a};
   };
   var textured = F2(function (src,
   shape) {
      return A2(fill,
      Texture(src),
      shape);
   });
   var Solid = function (a) {
      return {ctor: "Solid",_0: a};
   };
   var filled = F2(function (color,
   shape) {
      return A2(fill,
      Solid(color),
      shape);
   });
   var Form = F6(function (a,
   b,
   c,
   d,
   e,
   f) {
      return {_: {}
             ,alpha: e
             ,form: f
             ,scale: b
             ,theta: a
             ,x: c
             ,y: d};
   });
   _elm.Graphics.Collage.values = {_op: _op
                                  ,collage: collage
                                  ,toForm: toForm
                                  ,filled: filled
                                  ,textured: textured
                                  ,gradient: gradient
                                  ,outlined: outlined
                                  ,traced: traced
                                  ,text: text
                                  ,outlinedText: outlinedText
                                  ,move: move
                                  ,moveX: moveX
                                  ,moveY: moveY
                                  ,scale: scale
                                  ,rotate: rotate
                                  ,alpha: alpha
                                  ,group: group
                                  ,groupTransform: groupTransform
                                  ,rect: rect
                                  ,oval: oval
                                  ,square: square
                                  ,circle: circle
                                  ,ngon: ngon
                                  ,polygon: polygon
                                  ,segment: segment
                                  ,path: path
                                  ,solid: solid
                                  ,dashed: dashed
                                  ,dotted: dotted
                                  ,defaultLine: defaultLine
                                  ,Form: Form
                                  ,LineStyle: LineStyle
                                  ,Flat: Flat
                                  ,Round: Round
                                  ,Padded: Padded
                                  ,Smooth: Smooth
                                  ,Sharp: Sharp
                                  ,Clipped: Clipped};
   return _elm.Graphics.Collage.values;
};
Elm.Graphics = Elm.Graphics || {};
Elm.Graphics.Element = Elm.Graphics.Element || {};
Elm.Graphics.Element.make = function (_elm) {
   "use strict";
   _elm.Graphics = _elm.Graphics || {};
   _elm.Graphics.Element = _elm.Graphics.Element || {};
   if (_elm.Graphics.Element.values)
   return _elm.Graphics.Element.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Graphics.Element",
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Graphics$Element = Elm.Native.Graphics.Element.make(_elm),
   $Text = Elm.Text.make(_elm);
   var DOut = {ctor: "DOut"};
   var outward = DOut;
   var DIn = {ctor: "DIn"};
   var inward = DIn;
   var DRight = {ctor: "DRight"};
   var right = DRight;
   var DLeft = {ctor: "DLeft"};
   var left = DLeft;
   var DDown = {ctor: "DDown"};
   var down = DDown;
   var DUp = {ctor: "DUp"};
   var up = DUp;
   var Position = F4(function (a,
   b,
   c,
   d) {
      return {_: {}
             ,horizontal: a
             ,vertical: b
             ,x: c
             ,y: d};
   });
   var Relative = function (a) {
      return {ctor: "Relative"
             ,_0: a};
   };
   var relative = Relative;
   var Absolute = function (a) {
      return {ctor: "Absolute"
             ,_0: a};
   };
   var absolute = Absolute;
   var N = {ctor: "N"};
   var bottomLeftAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: N
             ,vertical: N
             ,x: x
             ,y: y};
   });
   var Z = {ctor: "Z"};
   var middle = {_: {}
                ,horizontal: Z
                ,vertical: Z
                ,x: Relative(0.5)
                ,y: Relative(0.5)};
   var midLeft = _U.replace([["horizontal"
                             ,N]
                            ,["x",Absolute(0)]],
   middle);
   var middleAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: Z
             ,vertical: Z
             ,x: x
             ,y: y};
   });
   var midLeftAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: N
             ,vertical: Z
             ,x: x
             ,y: y};
   });
   var midBottomAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: Z
             ,vertical: N
             ,x: x
             ,y: y};
   });
   var P = {ctor: "P"};
   var topLeft = {_: {}
                 ,horizontal: N
                 ,vertical: P
                 ,x: Absolute(0)
                 ,y: Absolute(0)};
   var bottomLeft = _U.replace([["vertical"
                                ,N]],
   topLeft);
   var topRight = _U.replace([["horizontal"
                              ,P]],
   topLeft);
   var bottomRight = _U.replace([["horizontal"
                                 ,P]],
   bottomLeft);
   var midRight = _U.replace([["horizontal"
                              ,P]],
   midLeft);
   var midTop = _U.replace([["vertical"
                            ,P]
                           ,["y",Absolute(0)]],
   middle);
   var midBottom = _U.replace([["vertical"
                               ,N]],
   midTop);
   var topLeftAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: N
             ,vertical: P
             ,x: x
             ,y: y};
   });
   var topRightAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: P
             ,vertical: P
             ,x: x
             ,y: y};
   });
   var bottomRightAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: P
             ,vertical: N
             ,x: x
             ,y: y};
   });
   var midRightAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: P
             ,vertical: Z
             ,x: x
             ,y: y};
   });
   var midTopAt = F2(function (x,
   y) {
      return {_: {}
             ,horizontal: Z
             ,vertical: P
             ,x: x
             ,y: y};
   });
   var justified = $Native$Graphics$Element.block("justify");
   var centered = $Native$Graphics$Element.block("center");
   var rightAligned = $Native$Graphics$Element.block("right");
   var leftAligned = $Native$Graphics$Element.block("left");
   var show = function (value) {
      return leftAligned($Text.monospace($Text.fromString($Basics.toString(value))));
   };
   var Tiled = {ctor: "Tiled"};
   var Cropped = function (a) {
      return {ctor: "Cropped"
             ,_0: a};
   };
   var Fitted = {ctor: "Fitted"};
   var Plain = {ctor: "Plain"};
   var Custom = {ctor: "Custom"};
   var RawHtml = {ctor: "RawHtml"};
   var Spacer = {ctor: "Spacer"};
   var Flow = F2(function (a,b) {
      return {ctor: "Flow"
             ,_0: a
             ,_1: b};
   });
   var Container = F2(function (a,
   b) {
      return {ctor: "Container"
             ,_0: a
             ,_1: b};
   });
   var Image = F4(function (a,
   b,
   c,
   d) {
      return {ctor: "Image"
             ,_0: a
             ,_1: b
             ,_2: c
             ,_3: d};
   });
   var newElement = $Native$Graphics$Element.newElement;
   var image = F3(function (w,
   h,
   src) {
      return A3(newElement,
      w,
      h,
      A4(Image,Plain,w,h,src));
   });
   var fittedImage = F3(function (w,
   h,
   src) {
      return A3(newElement,
      w,
      h,
      A4(Image,Fitted,w,h,src));
   });
   var croppedImage = F4(function (pos,
   w,
   h,
   src) {
      return A3(newElement,
      w,
      h,
      A4(Image,Cropped(pos),w,h,src));
   });
   var tiledImage = F3(function (w,
   h,
   src) {
      return A3(newElement,
      w,
      h,
      A4(Image,Tiled,w,h,src));
   });
   var container = F4(function (w,
   h,
   pos,
   e) {
      return A3(newElement,
      w,
      h,
      A2(Container,pos,e));
   });
   var spacer = F2(function (w,h) {
      return A3(newElement,
      w,
      h,
      Spacer);
   });
   var link = F2(function (href,
   e) {
      return function () {
         var p = e.props;
         return {_: {}
                ,element: e.element
                ,props: _U.replace([["href"
                                    ,href]],
                p)};
      }();
   });
   var tag = F2(function (name,e) {
      return function () {
         var p = e.props;
         return {_: {}
                ,element: e.element
                ,props: _U.replace([["tag"
                                    ,name]],
                p)};
      }();
   });
   var color = F2(function (c,e) {
      return function () {
         var p = e.props;
         return {_: {}
                ,element: e.element
                ,props: _U.replace([["color"
                                    ,$Maybe.Just(c)]],
                p)};
      }();
   });
   var opacity = F2(function (o,
   e) {
      return function () {
         var p = e.props;
         return {_: {}
                ,element: e.element
                ,props: _U.replace([["opacity"
                                    ,o]],
                p)};
      }();
   });
   var height = F2(function (nh,
   e) {
      return function () {
         var p = e.props;
         var props = function () {
            var _v0 = e.element;
            switch (_v0.ctor)
            {case "Image":
               return _U.replace([["width"
                                  ,$Basics.round($Basics.toFloat(_v0._1) / $Basics.toFloat(_v0._2) * $Basics.toFloat(nh))]],
                 p);}
            return p;
         }();
         return {_: {}
                ,element: e.element
                ,props: _U.replace([["height"
                                    ,nh]],
                p)};
      }();
   });
   var width = F2(function (nw,e) {
      return function () {
         var p = e.props;
         var props = function () {
            var _v5 = e.element;
            switch (_v5.ctor)
            {case "Image":
               return _U.replace([["height"
                                  ,$Basics.round($Basics.toFloat(_v5._2) / $Basics.toFloat(_v5._1) * $Basics.toFloat(nw))]],
                 p);
               case "RawHtml":
               return _U.replace([["height"
                                  ,$Basics.snd(A2($Native$Graphics$Element.htmlHeight,
                                  nw,
                                  e.element))]],
                 p);}
            return p;
         }();
         return {_: {}
                ,element: e.element
                ,props: _U.replace([["width"
                                    ,nw]],
                props)};
      }();
   });
   var size = F3(function (w,h,e) {
      return A2(height,
      h,
      A2(width,w,e));
   });
   var sizeOf = function (e) {
      return {ctor: "_Tuple2"
             ,_0: e.props.width
             ,_1: e.props.height};
   };
   var heightOf = function (e) {
      return e.props.height;
   };
   var widthOf = function (e) {
      return e.props.width;
   };
   var above = F2(function (hi,
   lo) {
      return A3(newElement,
      A2($Basics.max,
      widthOf(hi),
      widthOf(lo)),
      heightOf(hi) + heightOf(lo),
      A2(Flow,
      DDown,
      _L.fromArray([hi,lo])));
   });
   var below = F2(function (lo,
   hi) {
      return A3(newElement,
      A2($Basics.max,
      widthOf(hi),
      widthOf(lo)),
      heightOf(hi) + heightOf(lo),
      A2(Flow,
      DDown,
      _L.fromArray([hi,lo])));
   });
   var beside = F2(function (lft,
   rht) {
      return A3(newElement,
      widthOf(lft) + widthOf(rht),
      A2($Basics.max,
      heightOf(lft),
      heightOf(rht)),
      A2(Flow,
      right,
      _L.fromArray([lft,rht])));
   });
   var layers = function (es) {
      return function () {
         var hs = A2($List.map,
         heightOf,
         es);
         var ws = A2($List.map,
         widthOf,
         es);
         return A3(newElement,
         A2($Maybe.withDefault,
         0,
         $List.maximum(ws)),
         A2($Maybe.withDefault,
         0,
         $List.maximum(hs)),
         A2(Flow,DOut,es));
      }();
   };
   var empty = A2(spacer,0,0);
   var flow = F2(function (dir,
   es) {
      return function () {
         var newFlow = F2(function (w,
         h) {
            return A3(newElement,
            w,
            h,
            A2(Flow,dir,es));
         });
         var maxOrZero = function (list) {
            return A2($Maybe.withDefault,
            0,
            $List.maximum(list));
         };
         var hs = A2($List.map,
         heightOf,
         es);
         var ws = A2($List.map,
         widthOf,
         es);
         return _U.eq(es,
         _L.fromArray([])) ? empty : function () {
            switch (dir.ctor)
            {case "DDown":
               return A2(newFlow,
                 maxOrZero(ws),
                 $List.sum(hs));
               case "DIn": return A2(newFlow,
                 maxOrZero(ws),
                 maxOrZero(hs));
               case "DLeft": return A2(newFlow,
                 $List.sum(ws),
                 maxOrZero(hs));
               case "DOut": return A2(newFlow,
                 maxOrZero(ws),
                 maxOrZero(hs));
               case "DRight":
               return A2(newFlow,
                 $List.sum(ws),
                 maxOrZero(hs));
               case "DUp": return A2(newFlow,
                 maxOrZero(ws),
                 $List.sum(hs));}
            _U.badCase($moduleName,
            "between lines 362 and 368");
         }();
      }();
   });
   var Properties = F9(function (a,
   b,
   c,
   d,
   e,
   f,
   g,
   h,
   i) {
      return {_: {}
             ,click: i
             ,color: e
             ,height: c
             ,hover: h
             ,href: f
             ,id: a
             ,opacity: d
             ,tag: g
             ,width: b};
   });
   var Element = F2(function (a,
   b) {
      return {_: {}
             ,element: b
             ,props: a};
   });
   _elm.Graphics.Element.values = {_op: _op
                                  ,image: image
                                  ,fittedImage: fittedImage
                                  ,croppedImage: croppedImage
                                  ,tiledImage: tiledImage
                                  ,leftAligned: leftAligned
                                  ,rightAligned: rightAligned
                                  ,centered: centered
                                  ,justified: justified
                                  ,show: show
                                  ,width: width
                                  ,height: height
                                  ,size: size
                                  ,color: color
                                  ,opacity: opacity
                                  ,link: link
                                  ,tag: tag
                                  ,widthOf: widthOf
                                  ,heightOf: heightOf
                                  ,sizeOf: sizeOf
                                  ,flow: flow
                                  ,up: up
                                  ,down: down
                                  ,left: left
                                  ,right: right
                                  ,inward: inward
                                  ,outward: outward
                                  ,layers: layers
                                  ,above: above
                                  ,below: below
                                  ,beside: beside
                                  ,empty: empty
                                  ,spacer: spacer
                                  ,container: container
                                  ,middle: middle
                                  ,midTop: midTop
                                  ,midBottom: midBottom
                                  ,midLeft: midLeft
                                  ,midRight: midRight
                                  ,topLeft: topLeft
                                  ,topRight: topRight
                                  ,bottomLeft: bottomLeft
                                  ,bottomRight: bottomRight
                                  ,absolute: absolute
                                  ,relative: relative
                                  ,middleAt: middleAt
                                  ,midTopAt: midTopAt
                                  ,midBottomAt: midBottomAt
                                  ,midLeftAt: midLeftAt
                                  ,midRightAt: midRightAt
                                  ,topLeftAt: topLeftAt
                                  ,topRightAt: topRightAt
                                  ,bottomLeftAt: bottomLeftAt
                                  ,bottomRightAt: bottomRightAt
                                  ,Element: Element
                                  ,Position: Position};
   return _elm.Graphics.Element.values;
};
Elm.Howler = Elm.Howler || {};
Elm.Howler.make = function (_elm) {
   "use strict";
   _elm.Howler = _elm.Howler || {};
   if (_elm.Howler.values)
   return _elm.Howler.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Howler",
   $Basics = Elm.Basics.make(_elm),
   $Dict = Elm.Dict.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Howler = Elm.Native.Howler.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $Task = Elm.Task.make(_elm),
   $Time = Elm.Time.make(_elm);
   var isLooping = $Native$Howler.isLooping;
   var getSeek = $Native$Howler.getSeek;
   var getVolume = $Native$Howler.getVolume;
   var isMuted = $Native$Howler.isMuted;
   var getDuration = $Native$Howler.getDuration;
   var isPlaying = $Native$Howler.isPlaying;
   var loop = $Native$Howler.loop;
   var seek = $Native$Howler.seek;
   var fade = $Native$Howler.fade;
   var volume = $Native$Howler.volume;
   var mute = $Native$Howler.mute;
   var stop = $Native$Howler.stop;
   var pause = $Native$Howler.pause;
   var play = $Native$Howler.play;
   var playSound = play($Maybe.Nothing);
   var playSprite = function ($) {
      return play($Maybe.Just($));
   };
   var create = $Native$Howler.create;
   var emptySoundInstance = {_: {}
                            ,playId: $Maybe.Nothing
                            ,soundLabel: ""};
   var SoundInstance = F2(function (a,
   b) {
      return {_: {}
             ,playId: b
             ,soundLabel: a};
   });
   var emptyAudioObject = {_: {}
                          ,html5: $Maybe.Nothing
                          ,loop: $Maybe.Nothing
                          ,pool: $Maybe.Nothing
                          ,rate: $Maybe.Nothing
                          ,sprite: $Maybe.Nothing
                          ,src: _L.fromArray([])
                          ,volume: $Maybe.Nothing};
   var AudioObject = F7(function (a,
   b,
   c,
   d,
   e,
   f,
   g) {
      return {_: {}
             ,html5: d
             ,loop: b
             ,pool: g
             ,rate: f
             ,sprite: e
             ,src: a
             ,volume: c};
   });
   _elm.Howler.values = {_op: _op
                        ,AudioObject: AudioObject
                        ,emptyAudioObject: emptyAudioObject
                        ,SoundInstance: SoundInstance
                        ,emptySoundInstance: emptySoundInstance
                        ,create: create
                        ,play: play
                        ,playSound: playSound
                        ,playSprite: playSprite
                        ,pause: pause
                        ,stop: stop
                        ,mute: mute
                        ,volume: volume
                        ,fade: fade
                        ,seek: seek
                        ,loop: loop
                        ,isPlaying: isPlaying
                        ,getDuration: getDuration
                        ,isMuted: isMuted
                        ,getVolume: getVolume
                        ,getSeek: getSeek
                        ,isLooping: isLooping};
   return _elm.Howler.values;
};
Elm.Html = Elm.Html || {};
Elm.Html.make = function (_elm) {
   "use strict";
   _elm.Html = _elm.Html || {};
   if (_elm.Html.values)
   return _elm.Html.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Html",
   $Basics = Elm.Basics.make(_elm),
   $Graphics$Element = Elm.Graphics.Element.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $VirtualDom = Elm.VirtualDom.make(_elm);
   var fromElement = $VirtualDom.fromElement;
   var toElement = $VirtualDom.toElement;
   var text = $VirtualDom.text;
   var node = $VirtualDom.node;
   var body = node("body");
   var section = node("section");
   var nav = node("nav");
   var article = node("article");
   var aside = node("aside");
   var h1 = node("h1");
   var h2 = node("h2");
   var h3 = node("h3");
   var h4 = node("h4");
   var h5 = node("h5");
   var h6 = node("h6");
   var header = node("header");
   var footer = node("footer");
   var address = node("address");
   var main$ = node("main");
   var p = node("p");
   var hr = node("hr");
   var pre = node("pre");
   var blockquote = node("blockquote");
   var ol = node("ol");
   var ul = node("ul");
   var li = node("li");
   var dl = node("dl");
   var dt = node("dt");
   var dd = node("dd");
   var figure = node("figure");
   var figcaption = node("figcaption");
   var div = node("div");
   var a = node("a");
   var em = node("em");
   var strong = node("strong");
   var small = node("small");
   var s = node("s");
   var cite = node("cite");
   var q = node("q");
   var dfn = node("dfn");
   var abbr = node("abbr");
   var time = node("time");
   var code = node("code");
   var $var = node("var");
   var samp = node("samp");
   var kbd = node("kbd");
   var sub = node("sub");
   var sup = node("sup");
   var i = node("i");
   var b = node("b");
   var u = node("u");
   var mark = node("mark");
   var ruby = node("ruby");
   var rt = node("rt");
   var rp = node("rp");
   var bdi = node("bdi");
   var bdo = node("bdo");
   var span = node("span");
   var br = node("br");
   var wbr = node("wbr");
   var ins = node("ins");
   var del = node("del");
   var img = node("img");
   var iframe = node("iframe");
   var embed = node("embed");
   var object = node("object");
   var param = node("param");
   var video = node("video");
   var audio = node("audio");
   var source = node("source");
   var track = node("track");
   var canvas = node("canvas");
   var svg = node("svg");
   var math = node("math");
   var table = node("table");
   var caption = node("caption");
   var colgroup = node("colgroup");
   var col = node("col");
   var tbody = node("tbody");
   var thead = node("thead");
   var tfoot = node("tfoot");
   var tr = node("tr");
   var td = node("td");
   var th = node("th");
   var form = node("form");
   var fieldset = node("fieldset");
   var legend = node("legend");
   var label = node("label");
   var input = node("input");
   var button = node("button");
   var select = node("select");
   var datalist = node("datalist");
   var optgroup = node("optgroup");
   var option = node("option");
   var textarea = node("textarea");
   var keygen = node("keygen");
   var output = node("output");
   var progress = node("progress");
   var meter = node("meter");
   var details = node("details");
   var summary = node("summary");
   var menuitem = node("menuitem");
   var menu = node("menu");
   _elm.Html.values = {_op: _op
                      ,node: node
                      ,text: text
                      ,toElement: toElement
                      ,fromElement: fromElement
                      ,body: body
                      ,section: section
                      ,nav: nav
                      ,article: article
                      ,aside: aside
                      ,h1: h1
                      ,h2: h2
                      ,h3: h3
                      ,h4: h4
                      ,h5: h5
                      ,h6: h6
                      ,header: header
                      ,footer: footer
                      ,address: address
                      ,main$: main$
                      ,p: p
                      ,hr: hr
                      ,pre: pre
                      ,blockquote: blockquote
                      ,ol: ol
                      ,ul: ul
                      ,li: li
                      ,dl: dl
                      ,dt: dt
                      ,dd: dd
                      ,figure: figure
                      ,figcaption: figcaption
                      ,div: div
                      ,a: a
                      ,em: em
                      ,strong: strong
                      ,small: small
                      ,s: s
                      ,cite: cite
                      ,q: q
                      ,dfn: dfn
                      ,abbr: abbr
                      ,time: time
                      ,code: code
                      ,$var: $var
                      ,samp: samp
                      ,kbd: kbd
                      ,sub: sub
                      ,sup: sup
                      ,i: i
                      ,b: b
                      ,u: u
                      ,mark: mark
                      ,ruby: ruby
                      ,rt: rt
                      ,rp: rp
                      ,bdi: bdi
                      ,bdo: bdo
                      ,span: span
                      ,br: br
                      ,wbr: wbr
                      ,ins: ins
                      ,del: del
                      ,img: img
                      ,iframe: iframe
                      ,embed: embed
                      ,object: object
                      ,param: param
                      ,video: video
                      ,audio: audio
                      ,source: source
                      ,track: track
                      ,canvas: canvas
                      ,svg: svg
                      ,math: math
                      ,table: table
                      ,caption: caption
                      ,colgroup: colgroup
                      ,col: col
                      ,tbody: tbody
                      ,thead: thead
                      ,tfoot: tfoot
                      ,tr: tr
                      ,td: td
                      ,th: th
                      ,form: form
                      ,fieldset: fieldset
                      ,legend: legend
                      ,label: label
                      ,input: input
                      ,button: button
                      ,select: select
                      ,datalist: datalist
                      ,optgroup: optgroup
                      ,option: option
                      ,textarea: textarea
                      ,keygen: keygen
                      ,output: output
                      ,progress: progress
                      ,meter: meter
                      ,details: details
                      ,summary: summary
                      ,menuitem: menuitem
                      ,menu: menu};
   return _elm.Html.values;
};
Elm.Html = Elm.Html || {};
Elm.Html.Attributes = Elm.Html.Attributes || {};
Elm.Html.Attributes.make = function (_elm) {
   "use strict";
   _elm.Html = _elm.Html || {};
   _elm.Html.Attributes = _elm.Html.Attributes || {};
   if (_elm.Html.Attributes.values)
   return _elm.Html.Attributes.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Html.Attributes",
   $Basics = Elm.Basics.make(_elm),
   $Html = Elm.Html.make(_elm),
   $Json$Encode = Elm.Json.Encode.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $String = Elm.String.make(_elm),
   $VirtualDom = Elm.VirtualDom.make(_elm);
   var attribute = $VirtualDom.attribute;
   var property = $VirtualDom.property;
   var stringProperty = F2(function (name,
   string) {
      return A2(property,
      name,
      $Json$Encode.string(string));
   });
   var $class = function (name) {
      return A2(stringProperty,
      "className",
      name);
   };
   var id = function (name) {
      return A2(stringProperty,
      "id",
      name);
   };
   var title = function (name) {
      return A2(stringProperty,
      "title",
      name);
   };
   var accesskey = function ($char) {
      return A2(stringProperty,
      "accesskey",
      $String.fromList(_L.fromArray([$char])));
   };
   var contextmenu = function (value) {
      return A2(stringProperty,
      "contextmenu",
      value);
   };
   var dir = function (value) {
      return A2(stringProperty,
      "dir",
      value);
   };
   var draggable = function (value) {
      return A2(stringProperty,
      "draggable",
      value);
   };
   var dropzone = function (value) {
      return A2(stringProperty,
      "dropzone",
      value);
   };
   var itemprop = function (value) {
      return A2(stringProperty,
      "itemprop",
      value);
   };
   var lang = function (value) {
      return A2(stringProperty,
      "lang",
      value);
   };
   var tabindex = function (n) {
      return A2(stringProperty,
      "tabIndex",
      $Basics.toString(n));
   };
   var charset = function (value) {
      return A2(stringProperty,
      "charset",
      value);
   };
   var content = function (value) {
      return A2(stringProperty,
      "content",
      value);
   };
   var httpEquiv = function (value) {
      return A2(stringProperty,
      "httpEquiv",
      value);
   };
   var language = function (value) {
      return A2(stringProperty,
      "language",
      value);
   };
   var src = function (value) {
      return A2(stringProperty,
      "src",
      value);
   };
   var height = function (value) {
      return A2(stringProperty,
      "height",
      $Basics.toString(value));
   };
   var width = function (value) {
      return A2(stringProperty,
      "width",
      $Basics.toString(value));
   };
   var alt = function (value) {
      return A2(stringProperty,
      "alt",
      value);
   };
   var preload = function (value) {
      return A2(stringProperty,
      "preload",
      value);
   };
   var poster = function (value) {
      return A2(stringProperty,
      "poster",
      value);
   };
   var kind = function (value) {
      return A2(stringProperty,
      "kind",
      value);
   };
   var srclang = function (value) {
      return A2(stringProperty,
      "srclang",
      value);
   };
   var sandbox = function (value) {
      return A2(stringProperty,
      "sandbox",
      value);
   };
   var srcdoc = function (value) {
      return A2(stringProperty,
      "srcdoc",
      value);
   };
   var type$ = function (value) {
      return A2(stringProperty,
      "type",
      value);
   };
   var value = function (value) {
      return A2(stringProperty,
      "value",
      value);
   };
   var placeholder = function (value) {
      return A2(stringProperty,
      "placeholder",
      value);
   };
   var accept = function (value) {
      return A2(stringProperty,
      "accept",
      value);
   };
   var acceptCharset = function (value) {
      return A2(stringProperty,
      "acceptCharset",
      value);
   };
   var action = function (value) {
      return A2(stringProperty,
      "action",
      value);
   };
   var autocomplete = function (bool) {
      return A2(stringProperty,
      "autocomplete",
      bool ? "on" : "off");
   };
   var autosave = function (value) {
      return A2(stringProperty,
      "autosave",
      value);
   };
   var enctype = function (value) {
      return A2(stringProperty,
      "enctype",
      value);
   };
   var formaction = function (value) {
      return A2(stringProperty,
      "formaction",
      value);
   };
   var list = function (value) {
      return A2(stringProperty,
      "list",
      value);
   };
   var minlength = function (n) {
      return A2(stringProperty,
      "minLength",
      $Basics.toString(n));
   };
   var maxlength = function (n) {
      return A2(stringProperty,
      "maxLength",
      $Basics.toString(n));
   };
   var method = function (value) {
      return A2(stringProperty,
      "method",
      value);
   };
   var name = function (value) {
      return A2(stringProperty,
      "name",
      value);
   };
   var pattern = function (value) {
      return A2(stringProperty,
      "pattern",
      value);
   };
   var size = function (n) {
      return A2(stringProperty,
      "size",
      $Basics.toString(n));
   };
   var $for = function (value) {
      return A2(stringProperty,
      "htmlFor",
      value);
   };
   var form = function (value) {
      return A2(stringProperty,
      "form",
      value);
   };
   var max = function (value) {
      return A2(stringProperty,
      "max",
      value);
   };
   var min = function (value) {
      return A2(stringProperty,
      "min",
      value);
   };
   var step = function (n) {
      return A2(stringProperty,
      "step",
      n);
   };
   var cols = function (n) {
      return A2(stringProperty,
      "cols",
      $Basics.toString(n));
   };
   var rows = function (n) {
      return A2(stringProperty,
      "rows",
      $Basics.toString(n));
   };
   var wrap = function (value) {
      return A2(stringProperty,
      "wrap",
      value);
   };
   var usemap = function (value) {
      return A2(stringProperty,
      "useMap",
      value);
   };
   var shape = function (value) {
      return A2(stringProperty,
      "shape",
      value);
   };
   var coords = function (value) {
      return A2(stringProperty,
      "coords",
      value);
   };
   var challenge = function (value) {
      return A2(stringProperty,
      "challenge",
      value);
   };
   var keytype = function (value) {
      return A2(stringProperty,
      "keytype",
      value);
   };
   var align = function (value) {
      return A2(stringProperty,
      "align",
      value);
   };
   var cite = function (value) {
      return A2(stringProperty,
      "cite",
      value);
   };
   var href = function (value) {
      return A2(stringProperty,
      "href",
      value);
   };
   var target = function (value) {
      return A2(stringProperty,
      "target",
      value);
   };
   var downloadAs = function (value) {
      return A2(stringProperty,
      "download",
      value);
   };
   var hreflang = function (value) {
      return A2(stringProperty,
      "hreflang",
      value);
   };
   var media = function (value) {
      return A2(stringProperty,
      "media",
      value);
   };
   var ping = function (value) {
      return A2(stringProperty,
      "ping",
      value);
   };
   var rel = function (value) {
      return A2(stringProperty,
      "rel",
      value);
   };
   var datetime = function (value) {
      return A2(stringProperty,
      "datetime",
      value);
   };
   var pubdate = function (value) {
      return A2(stringProperty,
      "pubdate",
      value);
   };
   var start = function (n) {
      return A2(stringProperty,
      "start",
      $Basics.toString(n));
   };
   var colspan = function (n) {
      return A2(stringProperty,
      "colSpan",
      $Basics.toString(n));
   };
   var headers = function (value) {
      return A2(stringProperty,
      "headers",
      value);
   };
   var rowspan = function (n) {
      return A2(stringProperty,
      "rowSpan",
      $Basics.toString(n));
   };
   var scope = function (value) {
      return A2(stringProperty,
      "scope",
      value);
   };
   var manifest = function (value) {
      return A2(stringProperty,
      "manifest",
      value);
   };
   var boolProperty = F2(function (name,
   bool) {
      return A2(property,
      name,
      $Json$Encode.bool(bool));
   });
   var hidden = function (bool) {
      return A2(boolProperty,
      "hidden",
      bool);
   };
   var contenteditable = function (bool) {
      return A2(boolProperty,
      "contentEditable",
      bool);
   };
   var spellcheck = function (bool) {
      return A2(boolProperty,
      "spellcheck",
      bool);
   };
   var async = function (bool) {
      return A2(boolProperty,
      "async",
      bool);
   };
   var defer = function (bool) {
      return A2(boolProperty,
      "defer",
      bool);
   };
   var scoped = function (bool) {
      return A2(boolProperty,
      "scoped",
      bool);
   };
   var autoplay = function (bool) {
      return A2(boolProperty,
      "autoplay",
      bool);
   };
   var controls = function (bool) {
      return A2(boolProperty,
      "controls",
      bool);
   };
   var loop = function (bool) {
      return A2(boolProperty,
      "loop",
      bool);
   };
   var $default = function (bool) {
      return A2(boolProperty,
      "default",
      bool);
   };
   var seamless = function (bool) {
      return A2(boolProperty,
      "seamless",
      bool);
   };
   var checked = function (bool) {
      return A2(boolProperty,
      "checked",
      bool);
   };
   var selected = function (bool) {
      return A2(boolProperty,
      "selected",
      bool);
   };
   var autofocus = function (bool) {
      return A2(boolProperty,
      "autofocus",
      bool);
   };
   var disabled = function (bool) {
      return A2(boolProperty,
      "disabled",
      bool);
   };
   var multiple = function (bool) {
      return A2(boolProperty,
      "multiple",
      bool);
   };
   var novalidate = function (bool) {
      return A2(boolProperty,
      "noValidate",
      bool);
   };
   var readonly = function (bool) {
      return A2(boolProperty,
      "readOnly",
      bool);
   };
   var required = function (bool) {
      return A2(boolProperty,
      "required",
      bool);
   };
   var ismap = function (value) {
      return A2(boolProperty,
      "isMap",
      value);
   };
   var download = function (bool) {
      return A2(boolProperty,
      "download",
      bool);
   };
   var reversed = function (bool) {
      return A2(boolProperty,
      "reversed",
      bool);
   };
   var classList = function (list) {
      return $class($String.join(" ")($List.map($Basics.fst)($List.filter($Basics.snd)(list))));
   };
   var style = function (props) {
      return property("style")($Json$Encode.object($List.map(function (_v0) {
         return function () {
            switch (_v0.ctor)
            {case "_Tuple2":
               return {ctor: "_Tuple2"
                      ,_0: _v0._0
                      ,_1: $Json$Encode.string(_v0._1)};}
            _U.badCase($moduleName,
            "on line 156, column 35 to 57");
         }();
      })(props)));
   };
   var key = function (k) {
      return A2(stringProperty,
      "key",
      k);
   };
   _elm.Html.Attributes.values = {_op: _op
                                 ,key: key
                                 ,style: style
                                 ,$class: $class
                                 ,classList: classList
                                 ,id: id
                                 ,title: title
                                 ,hidden: hidden
                                 ,type$: type$
                                 ,value: value
                                 ,checked: checked
                                 ,placeholder: placeholder
                                 ,selected: selected
                                 ,accept: accept
                                 ,acceptCharset: acceptCharset
                                 ,action: action
                                 ,autocomplete: autocomplete
                                 ,autofocus: autofocus
                                 ,autosave: autosave
                                 ,disabled: disabled
                                 ,enctype: enctype
                                 ,formaction: formaction
                                 ,list: list
                                 ,maxlength: maxlength
                                 ,minlength: minlength
                                 ,method: method
                                 ,multiple: multiple
                                 ,name: name
                                 ,novalidate: novalidate
                                 ,pattern: pattern
                                 ,readonly: readonly
                                 ,required: required
                                 ,size: size
                                 ,$for: $for
                                 ,form: form
                                 ,max: max
                                 ,min: min
                                 ,step: step
                                 ,cols: cols
                                 ,rows: rows
                                 ,wrap: wrap
                                 ,href: href
                                 ,target: target
                                 ,download: download
                                 ,downloadAs: downloadAs
                                 ,hreflang: hreflang
                                 ,media: media
                                 ,ping: ping
                                 ,rel: rel
                                 ,ismap: ismap
                                 ,usemap: usemap
                                 ,shape: shape
                                 ,coords: coords
                                 ,src: src
                                 ,height: height
                                 ,width: width
                                 ,alt: alt
                                 ,autoplay: autoplay
                                 ,controls: controls
                                 ,loop: loop
                                 ,preload: preload
                                 ,poster: poster
                                 ,$default: $default
                                 ,kind: kind
                                 ,srclang: srclang
                                 ,sandbox: sandbox
                                 ,seamless: seamless
                                 ,srcdoc: srcdoc
                                 ,reversed: reversed
                                 ,start: start
                                 ,align: align
                                 ,colspan: colspan
                                 ,rowspan: rowspan
                                 ,headers: headers
                                 ,scope: scope
                                 ,async: async
                                 ,charset: charset
                                 ,content: content
                                 ,defer: defer
                                 ,httpEquiv: httpEquiv
                                 ,language: language
                                 ,scoped: scoped
                                 ,accesskey: accesskey
                                 ,contenteditable: contenteditable
                                 ,contextmenu: contextmenu
                                 ,dir: dir
                                 ,draggable: draggable
                                 ,dropzone: dropzone
                                 ,itemprop: itemprop
                                 ,lang: lang
                                 ,spellcheck: spellcheck
                                 ,tabindex: tabindex
                                 ,challenge: challenge
                                 ,keytype: keytype
                                 ,cite: cite
                                 ,datetime: datetime
                                 ,pubdate: pubdate
                                 ,manifest: manifest
                                 ,property: property
                                 ,attribute: attribute};
   return _elm.Html.Attributes.values;
};
Elm.Html = Elm.Html || {};
Elm.Html.Events = Elm.Html.Events || {};
Elm.Html.Events.make = function (_elm) {
   "use strict";
   _elm.Html = _elm.Html || {};
   _elm.Html.Events = _elm.Html.Events || {};
   if (_elm.Html.Events.values)
   return _elm.Html.Events.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Html.Events",
   $Basics = Elm.Basics.make(_elm),
   $Html = Elm.Html.make(_elm),
   $Json$Decode = Elm.Json.Decode.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $VirtualDom = Elm.VirtualDom.make(_elm);
   var keyCode = A2($Json$Decode._op[":="],
   "keyCode",
   $Json$Decode.$int);
   var targetChecked = A2($Json$Decode.at,
   _L.fromArray(["target"
                ,"checked"]),
   $Json$Decode.bool);
   var targetValue = A2($Json$Decode.at,
   _L.fromArray(["target"
                ,"value"]),
   $Json$Decode.string);
   var defaultOptions = $VirtualDom.defaultOptions;
   var Options = F2(function (a,
   b) {
      return {_: {}
             ,preventDefault: b
             ,stopPropagation: a};
   });
   var onWithOptions = $VirtualDom.onWithOptions;
   var on = $VirtualDom.on;
   var messageOn = F3(function (name,
   addr,
   msg) {
      return A3(on,
      name,
      $Json$Decode.value,
      function (_v0) {
         return function () {
            return A2($Signal.message,
            addr,
            msg);
         }();
      });
   });
   var onClick = messageOn("click");
   var onDoubleClick = messageOn("dblclick");
   var onMouseMove = messageOn("mousemove");
   var onMouseDown = messageOn("mousedown");
   var onMouseUp = messageOn("mouseup");
   var onMouseEnter = messageOn("mouseenter");
   var onMouseLeave = messageOn("mouseleave");
   var onMouseOver = messageOn("mouseover");
   var onMouseOut = messageOn("mouseout");
   var onBlur = messageOn("blur");
   var onFocus = messageOn("focus");
   var onSubmit = messageOn("submit");
   var onKey = F3(function (name,
   addr,
   handler) {
      return A3(on,
      name,
      keyCode,
      function (code) {
         return A2($Signal.message,
         addr,
         handler(code));
      });
   });
   var onKeyUp = onKey("keyup");
   var onKeyDown = onKey("keydown");
   var onKeyPress = onKey("keypress");
   _elm.Html.Events.values = {_op: _op
                             ,onBlur: onBlur
                             ,onFocus: onFocus
                             ,onSubmit: onSubmit
                             ,onKeyUp: onKeyUp
                             ,onKeyDown: onKeyDown
                             ,onKeyPress: onKeyPress
                             ,onClick: onClick
                             ,onDoubleClick: onDoubleClick
                             ,onMouseMove: onMouseMove
                             ,onMouseDown: onMouseDown
                             ,onMouseUp: onMouseUp
                             ,onMouseEnter: onMouseEnter
                             ,onMouseLeave: onMouseLeave
                             ,onMouseOver: onMouseOver
                             ,onMouseOut: onMouseOut
                             ,on: on
                             ,onWithOptions: onWithOptions
                             ,defaultOptions: defaultOptions
                             ,targetValue: targetValue
                             ,targetChecked: targetChecked
                             ,keyCode: keyCode
                             ,Options: Options};
   return _elm.Html.Events.values;
};
Elm.Html = Elm.Html || {};
Elm.Html.Events = Elm.Html.Events || {};
Elm.Html.Events.Extra = Elm.Html.Events.Extra || {};
Elm.Html.Events.Extra.make = function (_elm) {
   "use strict";
   _elm.Html = _elm.Html || {};
   _elm.Html.Events = _elm.Html.Events || {};
   _elm.Html.Events.Extra = _elm.Html.Events.Extra || {};
   if (_elm.Html.Events.Extra.values)
   return _elm.Html.Events.Extra.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Html.Events.Extra",
   $Basics = Elm.Basics.make(_elm),
   $Html = Elm.Html.make(_elm),
   $Html$Events = Elm.Html.Events.make(_elm),
   $Json$Decode = Elm.Json.Decode.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var ScrollEvent = F6(function (a,
   b,
   c,
   d,
   e,
   f) {
      return {_: {}
             ,clientHeight: e
             ,clientWidth: f
             ,scrollHeight: c
             ,scrollLeft: b
             ,scrollTop: a
             ,scrollWidth: d};
   });
   var scrollDecoder = function () {
      var targetDecoder = A7($Json$Decode.object6,
      ScrollEvent,
      A2($Json$Decode._op[":="],
      "scrollTop",
      $Json$Decode.$int),
      A2($Json$Decode._op[":="],
      "scrollLeft",
      $Json$Decode.$int),
      A2($Json$Decode._op[":="],
      "scrollHeight",
      $Json$Decode.$int),
      A2($Json$Decode._op[":="],
      "scrollWidth",
      $Json$Decode.$int),
      A2($Json$Decode._op[":="],
      "clientHeight",
      $Json$Decode.$int),
      A2($Json$Decode._op[":="],
      "clientWidth",
      $Json$Decode.$int));
      return A2($Json$Decode._op[":="],
      "target",
      targetDecoder);
   }();
   var onScroll = F2(function (address,
   f) {
      return A3($Html$Events.on,
      "scroll",
      scrollDecoder,
      function (scrollEvent) {
         return A2($Signal.message,
         address,
         f(scrollEvent));
      });
   });
   _elm.Html.Events.Extra.values = {_op: _op
                                   ,ScrollEvent: ScrollEvent
                                   ,scrollDecoder: scrollDecoder
                                   ,onScroll: onScroll};
   return _elm.Html.Events.Extra.values;
};
Elm.Html = Elm.Html || {};
Elm.Html.Lazy = Elm.Html.Lazy || {};
Elm.Html.Lazy.make = function (_elm) {
   "use strict";
   _elm.Html = _elm.Html || {};
   _elm.Html.Lazy = _elm.Html.Lazy || {};
   if (_elm.Html.Lazy.values)
   return _elm.Html.Lazy.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Html.Lazy",
   $Basics = Elm.Basics.make(_elm),
   $Html = Elm.Html.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $VirtualDom = Elm.VirtualDom.make(_elm);
   var lazy3 = $VirtualDom.lazy3;
   var lazy2 = $VirtualDom.lazy2;
   var lazy = $VirtualDom.lazy;
   _elm.Html.Lazy.values = {_op: _op
                           ,lazy: lazy
                           ,lazy2: lazy2
                           ,lazy3: lazy3};
   return _elm.Html.Lazy.values;
};
Elm.InteractiveStory = Elm.InteractiveStory || {};
Elm.InteractiveStory.make = function (_elm) {
   "use strict";
   _elm.InteractiveStory = _elm.InteractiveStory || {};
   if (_elm.InteractiveStory.values)
   return _elm.InteractiveStory.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "InteractiveStory",
   $Basics = Elm.Basics.make(_elm),
   $Effects = Elm.Effects.make(_elm),
   $Howler = Elm.Howler.make(_elm),
   $InteractiveStory$Action = Elm.InteractiveStory.Action.make(_elm),
   $InteractiveStory$Core = Elm.InteractiveStory.Core.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Mouse = Elm.Mouse.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $StartApp = Elm.StartApp.make(_elm),
   $StoryContent = Elm.StoryContent.make(_elm),
   $Task = Elm.Task.make(_elm),
   $Window = Elm.Window.make(_elm);
   var startAppMailbox = $Signal.mailbox({ctor: "_Tuple0"});
   var startApp = Elm.Native.Task.make(_elm).performSignal("startApp",
   $Signal.constant(A2($Signal.send,
   startAppMailbox.address,
   {ctor: "_Tuple0"})));
   var windowDimensions = A2($Signal.merge,
   A2($Signal.sampleOn,
   startAppMailbox.signal,
   $Window.dimensions),
   $Window.dimensions);
   var addAudioExtensions = function (file) {
      return A2($List.map,
      function (ext) {
         return A2($Basics._op["++"],
         "assets/audio/",
         A2($Basics._op["++"],file,ext));
      },
      _L.fromArray([".ogg"
                   ,".aac"
                   ,".mp3"]));
   };
   var app = $StartApp.start({_: {}
                             ,init: A2($InteractiveStory$Core.init,
                             $StoryContent.stuff,
                             _L.fromArray([{ctor: "_Tuple2"
                                           ,_0: "mansion-bgm"
                                           ,_1: _U.replace([["src"
                                                            ,addAudioExtensions("541205_Halloween-Waltz-LOOP")]
                                                           ,["html5"
                                                            ,$Maybe.Just(true)]],
                                           $Howler.emptyAudioObject)}
                                          ,{ctor: "_Tuple2"
                                           ,_0: "portal-bgm"
                                           ,_1: _U.replace([["src"
                                                            ,addAudioExtensions("452916_happy_halloween")]
                                                           ,["html5"
                                                            ,$Maybe.Just(true)]
                                                           ,["volume"
                                                            ,$Maybe.Just(0.9)]],
                                           $Howler.emptyAudioObject)}
                                          ,{ctor: "_Tuple2"
                                           ,_0: "trick-or-treat-bgm"
                                           ,_1: _U.replace([["html5"
                                                            ,$Maybe.Just(true)]
                                                           ,["src"
                                                            ,addAudioExtensions("563651_KH-Halloween-Town-Remix-2")]],
                                           $Howler.emptyAudioObject)}]))
                             ,inputs: _L.fromArray([A2($Signal._op["<~"],
                                                   $Basics.always($InteractiveStory$Action.NextBlock),
                                                   $Mouse.clicks)
                                                   ,A2($Signal._op["<~"],
                                                   $InteractiveStory$Action.WindowResize,
                                                   windowDimensions)])
                             ,update: $InteractiveStory$Core.update
                             ,view: $InteractiveStory$Core.render});
   var main = app.html;
   var tasks = Elm.Native.Task.make(_elm).performSignal("tasks",
   app.tasks);
   _elm.InteractiveStory.values = {_op: _op
                                  ,addAudioExtensions: addAudioExtensions
                                  ,app: app
                                  ,main: main
                                  ,windowDimensions: windowDimensions
                                  ,startAppMailbox: startAppMailbox};
   return _elm.InteractiveStory.values;
};
Elm.InteractiveStory = Elm.InteractiveStory || {};
Elm.InteractiveStory.Action = Elm.InteractiveStory.Action || {};
Elm.InteractiveStory.Action.make = function (_elm) {
   "use strict";
   _elm.InteractiveStory = _elm.InteractiveStory || {};
   _elm.InteractiveStory.Action = _elm.InteractiveStory.Action || {};
   if (_elm.InteractiveStory.Action.values)
   return _elm.InteractiveStory.Action.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "InteractiveStory.Action",
   $Animation = Elm.Animation.make(_elm),
   $AnimationWrapper = Elm.AnimationWrapper.make(_elm),
   $Basics = Elm.Basics.make(_elm),
   $Html$Events$Extra = Elm.Html.Events.Extra.make(_elm),
   $InteractiveStory$Sound = Elm.InteractiveStory.Sound.make(_elm),
   $InteractiveStory$StoryBlockAction = Elm.InteractiveStory.StoryBlockAction.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var Stop = {ctor: "Stop"};
   var Label = function (a) {
      return {ctor: "Label",_0: a};
   };
   var Continue = {ctor: "Continue"};
   var emptyEffectSet = {_: {}
                        ,soundUpdates: _L.fromArray([])
                        ,variableEdits: _L.fromArray([])};
   var EffectSet = F2(function (a,
   b) {
      return {_: {}
             ,soundUpdates: b
             ,variableEdits: a};
   });
   var UpdateBool = F2(function (a,
   b) {
      return {ctor: "UpdateBool"
             ,_0: a
             ,_1: b};
   });
   var UpdateNum = F2(function (a,
   b) {
      return {ctor: "UpdateNum"
             ,_0: a
             ,_1: b};
   });
   var UpdateString = F2(function (a,
   b) {
      return {ctor: "UpdateString"
             ,_0: a
             ,_1: b};
   });
   var SetBool = F2(function (a,
   b) {
      return {ctor: "SetBool"
             ,_0: a
             ,_1: b};
   });
   var SetNum = F2(function (a,b) {
      return {ctor: "SetNum"
             ,_0: a
             ,_1: b};
   });
   var SetString = F2(function (a,
   b) {
      return {ctor: "SetString"
             ,_0: a
             ,_1: b};
   });
   var NoOp = {ctor: "NoOp"};
   var RunEffectSetBeforeLeave = function (a) {
      return {ctor: "RunEffectSetBeforeLeave"
             ,_0: a};
   };
   var RunEffectSet = function (a) {
      return {ctor: "RunEffectSet"
             ,_0: a};
   };
   var ScrollTick = function (a) {
      return {ctor: "ScrollTick"
             ,_0: a};
   };
   var ApplyChunking = function (a) {
      return {ctor: "ApplyChunking"
             ,_0: a};
   };
   var AnimateScroll = function (a) {
      return {ctor: "AnimateScroll"
             ,_0: a};
   };
   var UserScroll = function (a) {
      return {ctor: "UserScroll"
             ,_0: a};
   };
   var WindowResize = function (a) {
      return {ctor: "WindowResize"
             ,_0: a};
   };
   var StoryBlockAction = function (a) {
      return {ctor: "StoryBlockAction"
             ,_0: a};
   };
   var Batch = function (a) {
      return {ctor: "Batch",_0: a};
   };
   var EditVar = function (a) {
      return {ctor: "EditVar"
             ,_0: a};
   };
   var SoundAction = function (a) {
      return {ctor: "SoundAction"
             ,_0: a};
   };
   var JumpToLabel = function (a) {
      return {ctor: "JumpToLabel"
             ,_0: a};
   };
   var NextBlock = {ctor: "NextBlock"};
   _elm.InteractiveStory.Action.values = {_op: _op
                                         ,NextBlock: NextBlock
                                         ,JumpToLabel: JumpToLabel
                                         ,SoundAction: SoundAction
                                         ,EditVar: EditVar
                                         ,Batch: Batch
                                         ,StoryBlockAction: StoryBlockAction
                                         ,WindowResize: WindowResize
                                         ,UserScroll: UserScroll
                                         ,AnimateScroll: AnimateScroll
                                         ,ApplyChunking: ApplyChunking
                                         ,ScrollTick: ScrollTick
                                         ,RunEffectSet: RunEffectSet
                                         ,RunEffectSetBeforeLeave: RunEffectSetBeforeLeave
                                         ,NoOp: NoOp
                                         ,SetString: SetString
                                         ,SetNum: SetNum
                                         ,SetBool: SetBool
                                         ,UpdateString: UpdateString
                                         ,UpdateNum: UpdateNum
                                         ,UpdateBool: UpdateBool
                                         ,EffectSet: EffectSet
                                         ,emptyEffectSet: emptyEffectSet
                                         ,Continue: Continue
                                         ,Label: Label
                                         ,Stop: Stop};
   return _elm.InteractiveStory.Action.values;
};
Elm.InteractiveStory = Elm.InteractiveStory || {};
Elm.InteractiveStory.Core = Elm.InteractiveStory.Core || {};
Elm.InteractiveStory.Core.make = function (_elm) {
   "use strict";
   _elm.InteractiveStory = _elm.InteractiveStory || {};
   _elm.InteractiveStory.Core = _elm.InteractiveStory.Core || {};
   if (_elm.InteractiveStory.Core.values)
   return _elm.InteractiveStory.Core.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "InteractiveStory.Core",
   $Animation = Elm.Animation.make(_elm),
   $AnimationWrapper = Elm.AnimationWrapper.make(_elm),
   $Basics = Elm.Basics.make(_elm),
   $DOMInterface = Elm.DOMInterface.make(_elm),
   $Dict = Elm.Dict.make(_elm),
   $Effects = Elm.Effects.make(_elm),
   $Howler = Elm.Howler.make(_elm),
   $Html = Elm.Html.make(_elm),
   $Html$Attributes = Elm.Html.Attributes.make(_elm),
   $Html$Events$Extra = Elm.Html.Events.Extra.make(_elm),
   $Html$Lazy = Elm.Html.Lazy.make(_elm),
   $InteractiveStory$Action = Elm.InteractiveStory.Action.make(_elm),
   $InteractiveStory$Sound = Elm.InteractiveStory.Sound.make(_elm),
   $InteractiveStory$StoryBlock = Elm.InteractiveStory.StoryBlock.make(_elm),
   $InteractiveStory$StoryBlockAction = Elm.InteractiveStory.StoryBlockAction.make(_elm),
   $InteractiveStory$Styles$Core = Elm.InteractiveStory.Styles.Core.make(_elm),
   $InteractiveStory$VariableModel = Elm.InteractiveStory.VariableModel.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $SelectionList = Elm.SelectionList.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $Task = Elm.Task.make(_elm);
   var partitionChunks = function (model) {
      return function () {
         var toChunks = $List.map(function (_v0) {
            return function () {
               return {_: {}
                      ,blocks: _v0.blocks
                      ,height: _v0.height};
            }();
         });
         var viewportPrerenderMargin = $Basics.toFloat(model.scrollData.clientHeight) * 0.1;
         var viewportTop = $Basics.toFloat(model.scrollData.scrollTop) - viewportPrerenderMargin;
         var comesBeforeViewport = function (_v2) {
            return function () {
               return _U.cmp(_v2.top + _v2.height,
               viewportTop) < 1;
            }();
         };
         var viewportBottom = $Basics.toFloat(model.scrollData.scrollTop + model.scrollData.clientHeight) + viewportPrerenderMargin;
         var collidesWithViewport = function (_v4) {
            return function () {
               return _U.cmp(_v4.top,
               viewportTop) > -1 && _U.cmp(_v4.top,
               viewportBottom) < 1 || (_U.cmp(_v4.top + _v4.height,
               viewportTop) > -1 && _U.cmp(_v4.top + _v4.height,
               viewportBottom) < 1 || _U.cmp(_v4.top,
               viewportTop) < 1 && _U.cmp(_v4.top + _v4.height,
               viewportBottom) > -1);
            }();
         };
         var chunksTopToBottom = $List.reverse(model.chunkStack);
         var chunksWithTop = $List.reverse($Basics.fst(A3($List.foldl,
         F2(function (_v6,_v7) {
            return function () {
               switch (_v7.ctor)
               {case "_Tuple2":
                  return function () {
                       return {ctor: "_Tuple2"
                              ,_0: A2($List._op["::"],
                              {_: {}
                              ,blocks: _v6.blocks
                              ,height: _v6.height
                              ,top: _v7._1},
                              _v7._0)
                              ,_1: _v7._1 + _v6.height};
                    }();}
               _U.badCase($moduleName,
               "on line 434, column 23 to 114");
            }();
         }),
         {ctor: "_Tuple2"
         ,_0: _L.fromArray([])
         ,_1: $InteractiveStory$Styles$Core.topBarAnimationFrom},
         chunksTopToBottom)));
         var $ = A2($List.partition,
         collidesWithViewport,
         chunksWithTop),
         collidingChunks = $._0,
         nonCollidingChunks = $._1;
         var $ = A2($List.partition,
         comesBeforeViewport,
         nonCollidingChunks),
         beforeViewport = $._0,
         afterViewport = $._1;
         return {ctor: "_Tuple3"
                ,_0: toChunks(beforeViewport)
                ,_1: toChunks(collidingChunks)
                ,_2: toChunks(afterViewport)};
      }();
   };
   var getChunkBlockHeight = A2($List.foldl,
   F2(function (_v12,sum) {
      return function () {
         return sum + _v12.height;
      }();
   }),
   0);
   var render = F2(function (address,
   model) {
      return function () {
         var scrollData = model.scrollData;
         var $ = partitionChunks(model),
         chunksBeforeViewport = $._0,
         chunksWithinViewport = $._1,
         chunksAfterViewport = $._2;
         return A3($Html$Lazy.lazy2,
         $Html.div,
         _L.fromArray([$Html$Attributes.$class("interactive-story-container")
                      ,$Html$Attributes.style($InteractiveStory$Styles$Core.bodyDiv($InteractiveStory$Styles$Core.fullscreen(_L.fromArray([]))))
                      ,A2($Html$Events$Extra.onScroll,
                      address,
                      $InteractiveStory$Action.UserScroll)]),
         A2($Basics._op["++"],
         _L.fromArray([A2($Html.div,
                      _L.fromArray([$Html$Attributes.style(A3($InteractiveStory$Styles$Core.topBar,
                      _U.replace([["scrollTop",0]],
                      scrollData),
                      model.windowWidth,
                      _L.fromArray([])))]),
                      _L.fromArray([A2($Html.div,
                      _L.fromArray([$Html$Attributes.style($InteractiveStory$Styles$Core.fixed(A3($InteractiveStory$Styles$Core.topBar,
                      model.scrollData,
                      model.windowWidth,
                      _L.fromArray([]))))]),
                      _L.fromArray([A2($Html.div,
                      _L.fromArray([$Html$Attributes.style(A3($InteractiveStory$Styles$Core.topBarBanner,
                      model.scrollData,
                      model.windowWidth,
                      _L.fromArray([])))]),
                      _L.fromArray([A2($Html.a,
                      _L.fromArray([$Html$Attributes.href("/")
                                   ,$Html$Attributes.target("_blank")]),
                      _L.fromArray([A2($Html.img,
                      _L.fromArray([$Html$Attributes.src("assets/images/banner2.png")
                                   ,$Html$Attributes.style($InteractiveStory$Styles$Core.topBarImage(_L.fromArray([])))]),
                      _L.fromArray([]))]))]))]))]))
                      ,A2($Html.div,
                      _L.fromArray([$Html$Attributes.style(A2($InteractiveStory$Styles$Core.spacer,
                      $Basics.round(getChunkBlockHeight(chunksBeforeViewport)),
                      _L.fromArray([])))]),
                      _L.fromArray([]))]),
         A2($Basics._op["++"],
         $List.map(function (historyRender) {
            return A2($Html$Lazy.lazy,
            historyRender,
            address);
         })($List.concat($List.map(function (_) {
            return _.blocks;
         })(chunksWithinViewport))),
         A2($Basics._op["++"],
         _L.fromArray([A2($Html.div,
         _L.fromArray([$Html$Attributes.style(A2($InteractiveStory$Styles$Core.spacer,
         $Basics.round(getChunkBlockHeight(chunksAfterViewport)),
         _L.fromArray([])))]),
         _L.fromArray([]))]),
         A2($Basics._op["++"],
         A2($Basics._op["++"],
         A2($List.map,
         function (historyRender) {
            return A2($Html$Lazy.lazy,
            historyRender,
            address);
         },
         model.blockHistory),
         _L.fromArray([A4($InteractiveStory$StoryBlock.render,
         address,
         true,
         model.vars,
         model.storyTrack.selected)])),
         _L.fromArray([A2($Html.div,
                      _L.fromArray([$Html$Attributes.style(A2($InteractiveStory$Styles$Core.instructionBlock,
                      model.scrollData,
                      _L.fromArray([])))]),
                      _L.fromArray([$Html.text(model.instructionText)]))
                      ,A2($Html.div,
                      _L.fromArray([$Html$Attributes.style($InteractiveStory$Styles$Core.linkArea(_L.fromArray([])))]),
                      _L.fromArray([A2($Html.ul,
                      _L.fromArray([]),
                      _L.fromArray([A2($Html.li,
                                   _L.fromArray([$Html$Attributes.style($InteractiveStory$Styles$Core.imgList(_L.fromArray([])))]),
                                   _L.fromArray([A2($Html.a,
                                   _L.fromArray([$Html$Attributes.href("/read.html")
                                                ,$Html$Attributes.target("_blank")
                                                ,$Html$Attributes.style($InteractiveStory$Styles$Core.link(_L.fromArray([])))]),
                                   _L.fromArray([$Html.text("Read Midnight Murder Party")]))]))
                                   ,A2($Html.li,
                                   _L.fromArray([$Html$Attributes.style($InteractiveStory$Styles$Core.imgList(_L.fromArray([])))]),
                                   _L.fromArray([A2($Html.a,
                                   _L.fromArray([$Html$Attributes.href("credits.html")
                                                ,$Html$Attributes.target("_blank")
                                                ,$Html$Attributes.style($InteractiveStory$Styles$Core.link(_L.fromArray([])))]),
                                   _L.fromArray([$Html.text("Credits")]))]))]))]))
                      ,A2($Html.div,
                      _L.fromArray([$Html$Attributes.style(A2($InteractiveStory$Styles$Core.spacer,
                      $Basics.round($Basics.toFloat(model.windowHeight) / 1.4),
                      _L.fromArray([])))]),
                      _L.fromArray([]))]))))));
      }();
   });
   var scrollToLast = function (model) {
      return $Effects.task($Task.map(function (result) {
         return function () {
            switch (result.ctor)
            {case "Just":
               return $InteractiveStory$Action.AnimateScroll($Animation.duration(500)($Animation.to($Basics.toFloat(model.scrollData.scrollTop + $Basics.round(result._0.top) - $Basics.round($Basics.toFloat(model.windowHeight) * 0.2)))($Animation.from($Basics.toFloat(model.scrollData.scrollTop))($Animation.animation(0)))));
               case "Nothing":
               return $InteractiveStory$Action.NoOp;}
            _U.badCase($moduleName,
            "between lines 349 and 357");
         }();
      })($Task.toMaybe(A2($Task.andThen,
      A2($Task.andThen,
      $Task.sleep(50),
      function (_v14) {
         return function () {
            return $DOMInterface.getElementPositionInfo(".story-block");
         }();
      }),
      function ($) {
         return $Task.fromMaybe($DOMInterface.NodeUndefined)($List.head($List.reverse($)));
      }))));
   };
   var getIndexOfLabel = F2(function (label,
   model) {
      return function () {
         var getIndexOfLabel$ = F3(function (label,
         blockList,
         index) {
            return function () {
               switch (blockList.ctor)
               {case "::":
                  return _U.eq(blockList._0.label,
                    label) ? $Maybe.Just(index) : A3(getIndexOfLabel$,
                    label,
                    blockList._1,
                    index + 1);
                  case "[]":
                  return $Maybe.Nothing;}
               _U.badCase($moduleName,
               "between lines 337 and 340");
            }();
         });
         return A3(getIndexOfLabel$,
         $Maybe.Just(label),
         $SelectionList.toList(model.storyTrack),
         0);
      }();
   });
   var addAdditionalEffects = F2(function (extraEffects,
   _v21) {
      return function () {
         switch (_v21.ctor)
         {case "_Tuple2":
            return {ctor: "_Tuple2"
                   ,_0: _v21._0
                   ,_1: $Effects.batch(A2($List._op["::"],
                   _v21._1,
                   extraEffects))};}
         _U.badCase($moduleName,
         "on line 306, column 6 to 53");
      }();
   });
   var applyChunking = function (_v25) {
      return function () {
         switch (_v25.ctor)
         {case "_Tuple2":
            return function () {
                 var chunkSize = _v25._0.chunkSize;
                 var chunkItUp = $Effects.task($Task.map($Maybe.withDefault($InteractiveStory$Action.NoOp))($Task.map($Maybe.map($InteractiveStory$Action.ApplyChunking))($Task.toMaybe(A2($Task.andThen,
                 A2($Task.andThen,
                 $DOMInterface.getElementPositionInfo(".story-block"),
                 function ($) {
                    return $Task.fromMaybe($DOMInterface.NodeUndefined)($List.head($));
                 }),
                 function (startElem) {
                    return A2($Task.andThen,
                    A2($Task.andThen,
                    $DOMInterface.getElementPositionInfo(".story-block"),
                    function ($) {
                       return $Task.fromMaybe($DOMInterface.NodeUndefined)($List.head($List.drop(chunkSize)($)));
                    }),
                    function (lastElem) {
                       return $Task.succeed(lastElem.top - lastElem.margin.top - (startElem.top - startElem.margin.top));
                    });
                 })))));
                 var threshold = _v25._0.chunkingThreshold;
                 return _U.cmp($List.length(_v25._0.blockHistory),
                 chunkSize + threshold) > -1 && $Basics.not(_v25._0.chunking) ? A2(addAdditionalEffects,
                 _L.fromArray([chunkItUp]),
                 {ctor: "_Tuple2"
                 ,_0: _U.replace([["chunking"
                                  ,true]],
                 _v25._0)
                 ,_1: _v25._1}) : {ctor: "_Tuple2"
                                  ,_0: _v25._0
                                  ,_1: _v25._1};
              }();}
         _U.badCase($moduleName,
         "between lines 310 and 330");
      }();
   };
   var jumpTo = F3(function (label,
   _v29,
   _v30) {
      return function () {
         switch (_v30.ctor)
         {case "_Tuple2":
            return function () {
                 return $Maybe.withDefault({ctor: "_Tuple2"
                                           ,_0: _v30._0
                                           ,_1: _v30._1})(A2($Maybe.andThen,
                 A2(getIndexOfLabel,
                 label,
                 _v30._0),
                 function (index) {
                    return $Maybe.Just({ctor: "_Tuple2"
                                       ,_0: _U.replace([["storyTrack"
                                                        ,A2($SelectionList.$goto,
                                                        index,
                                                        _v30._0.storyTrack)]],
                                       _v30._0)
                                       ,_1: _v30._1});
                 }));
              }();}
         _U.badCase($moduleName,
         "between lines 299 and 302");
      }();
   });
   var moveTrackForward = F2(function (vars,
   _v35) {
      return function () {
         switch (_v35.ctor)
         {case "_Tuple2":
            return function () {
                 var _v39 = _v35._0.storyTrack.selected.next(vars);
                 switch (_v39.ctor)
                 {case "Continue":
                    return {ctor: "_Tuple2"
                           ,_0: _U.replace([["storyTrack"
                                            ,$SelectionList.next(_v35._0.storyTrack)]],
                           _v35._0)
                           ,_1: _v35._1};
                    case "Label": return A3(jumpTo,
                      _v39._0,
                      vars,
                      {ctor: "_Tuple2"
                      ,_0: _v35._0
                      ,_1: _v35._1});
                    case "Stop":
                    return {ctor: "_Tuple2"
                           ,_0: _v35._0
                           ,_1: _v35._1};}
                 _U.badCase($moduleName,
                 "between lines 292 and 295");
              }();}
         _U.badCase($moduleName,
         "between lines 292 and 295");
      }();
   });
   var removeRepeatBlocks = F2(function (oldModel,
   _v41) {
      return function () {
         switch (_v41.ctor)
         {case "_Tuple2":
            return _U.eq($SelectionList.selectedIndex(_v41._0.storyTrack),
              $SelectionList.selectedIndex(oldModel.storyTrack)) || $InteractiveStory$StoryBlock.animationInProgress(oldModel.storyTrack.selected) ? {ctor: "_Tuple2"
                                                                                                                                                     ,_0: oldModel
                                                                                                                                                     ,_1: $Effects.none} : {ctor: "_Tuple2"
                                                                                                                                                                           ,_0: _v41._0
                                                                                                                                                                           ,_1: _v41._1};}
         _U.badCase($moduleName,
         "between lines 285 and 288");
      }();
   });
   var animateBlockIn = function (_v45) {
      return function () {
         switch (_v45.ctor)
         {case "_Tuple2":
            return function () {
                 var $ = A2($InteractiveStory$StoryBlock.update,
                 $InteractiveStory$StoryBlockAction.AnimateIn,
                 _v45._0.storyTrack.selected),
                 newStoryBlock = $._0,
                 effects$ = $._1;
                 var newStoryTrack = A2($SelectionList.updateSelected,
                 $Basics.always(newStoryBlock),
                 _v45._0.storyTrack);
                 return {ctor: "_Tuple2"
                        ,_0: _U.replace([["storyTrack"
                                         ,newStoryTrack]],
                        _v45._0)
                        ,_1: $Effects.batch(_L.fromArray([_v45._1
                                                         ,A2($Effects.map,
                                                         $InteractiveStory$Action.StoryBlockAction,
                                                         effects$)]))};
              }();}
         _U.badCase($moduleName,
         "between lines 279 and 281");
      }();
   };
   var scrollToBlock = function (_v49) {
      return function () {
         switch (_v49.ctor)
         {case "_Tuple2":
            return A2(addAdditionalEffects,
              _L.fromArray([scrollToLast(_v49._0)]),
              {ctor: "_Tuple2"
              ,_0: _v49._0
              ,_1: _v49._1});}
         _U.badCase($moduleName,
         "on line 275, column 5 to 62");
      }();
   };
   var addToHistory = function (_v53) {
      return function () {
         switch (_v53.ctor)
         {case "_Tuple2":
            return function () {
                 var newHistoricalBlock = function (addr) {
                    return A4($InteractiveStory$StoryBlock.render,
                    addr,
                    false,
                    _v53._0.vars,
                    _v53._0.storyTrack.selected);
                 };
                 return {ctor: "_Tuple2"
                        ,_0: _U.replace([["blockHistory"
                                         ,A2($Basics._op["++"],
                                         _v53._0.blockHistory,
                                         _L.fromArray([newHistoricalBlock]))]],
                        _v53._0)
                        ,_1: _v53._1};
              }();}
         _U.badCase($moduleName,
         "between lines 245 and 246");
      }();
   };
   var initStoryBlock = function (_v57) {
      return function () {
         switch (_v57.ctor)
         {case "_Tuple2":
            return function () {
                 var $ = A2($InteractiveStory$StoryBlock.update,
                 $InteractiveStory$StoryBlockAction.Init(_v57._0.vars),
                 _v57._0.storyTrack.selected),
                 newBlock = $._0,
                 newEffects = $._1;
                 var newStoryTrack = A2($SelectionList.updateSelected,
                 $Basics.always(newBlock),
                 _v57._0.storyTrack);
                 return {ctor: "_Tuple2"
                        ,_0: _U.replace([["storyTrack"
                                         ,newStoryTrack]],
                        _v57._0)
                        ,_1: $Effects.batch(_L.fromArray([_v57._1
                                                         ,A2($Effects.map,
                                                         $InteractiveStory$Action.StoryBlockAction,
                                                         newEffects)]))};
              }();}
         _U.badCase($moduleName,
         "between lines 239 and 241");
      }();
   };
   var skipIfInitialRun = F2(function (initialRun,
   f) {
      return initialRun ? $Basics.identity : f;
   });
   var updateInstructions = function (_v61) {
      return function () {
         switch (_v61.ctor)
         {case "_Tuple2":
            return function () {
                 var block = _v61._0.storyTrack.selected;
                 var newInstr = _U.eq(block.next(_v61._0.vars),
                 $InteractiveStory$Action.Stop) ? _U.eq(block.choiceModel,
                 $Maybe.Nothing) ? "End." : "Select an option to proceed." : "Click anywhere to proceed.";
                 return {ctor: "_Tuple2"
                        ,_0: _U.replace([["instructionText"
                                         ,newInstr]],
                        _v61._0)
                        ,_1: _v61._1};
              }();}
         _U.badCase($moduleName,
         "between lines 215 and 222");
      }();
   };
   var update = F2(function (action,
   model) {
      return function () {
         switch (action.ctor)
         {case "AnimateScroll":
            return function () {
                 var $ = A2($AnimationWrapper.update,
                 $AnimationWrapper.Start(action._0),
                 $AnimationWrapper.empty),
                 newScrollAnimation = $._0,
                 newEffects = $._1;
                 return A2(F2(function (v0,v1) {
                    return {ctor: "_Tuple2"
                           ,_0: v0
                           ,_1: v1};
                 }),
                 _U.replace([["scrollAnimation"
                             ,newScrollAnimation]],
                 model),
                 A2($Effects.map,
                 $InteractiveStory$Action.ScrollTick,
                 newEffects));
              }();
            case "ApplyChunking":
            return function () {
                 var newHistory = A2($List.drop,
                 model.chunkSize,
                 model.blockHistory);
                 var newChunk = {_: {}
                                ,blocks: A2($List.take,
                                model.chunkSize,
                                model.blockHistory)
                                ,height: action._0};
                 return {ctor: "_Tuple2"
                        ,_0: _U.replace([["chunkStack"
                                         ,A2($List._op["::"],
                                         newChunk,
                                         model.chunkStack)]
                                        ,["blockHistory",newHistory]
                                        ,["chunking",false]],
                        model)
                        ,_1: $Effects.none};
              }();
            case "Batch":
            return function () {
                 var foldFn = F2(function (action$,
                 _v80) {
                    return function () {
                       switch (_v80.ctor)
                       {case "_Tuple2":
                          return function () {
                               var $ = A2(update,
                               action$,
                               _v80._0),
                               newModel = $._0,
                               newEffects = $._1;
                               return {ctor: "_Tuple2"
                                      ,_0: newModel
                                      ,_1: $Effects.batch(_L.fromArray([_v80._1
                                                                       ,newEffects]))};
                            }();}
                       _U.badCase($moduleName,
                       "between lines 182 and 183");
                    }();
                 });
                 return A3($List.foldl,
                 foldFn,
                 {ctor: "_Tuple2"
                 ,_0: model
                 ,_1: $Effects.none},
                 action._0);
              }();
            case "EditVar":
            return function () {
                 var vars = model.vars;
                 var newVars = function () {
                    switch (action._0.ctor)
                    {case "SetBool":
                       return _U.replace([["bool"
                                          ,A3($Dict.insert,
                                          action._0._0,
                                          action._0._1,
                                          model.vars.bool)]],
                         vars);
                       case "SetNum":
                       return _U.replace([["num"
                                          ,A3($Dict.insert,
                                          action._0._0,
                                          action._0._1,
                                          model.vars.num)]],
                         vars);
                       case "SetString":
                       return _U.replace([["string"
                                          ,A3($Dict.insert,
                                          action._0._0,
                                          action._0._1,
                                          model.vars.string)]],
                         vars);
                       case "UpdateBool":
                       return _U.replace([["bool"
                                          ,A3($Dict.update,
                                          action._0._0,
                                          action._0._1,
                                          model.vars.bool)]],
                         vars);
                       case "UpdateNum":
                       return _U.replace([["num"
                                          ,A3($Dict.update,
                                          action._0._0,
                                          action._0._1,
                                          model.vars.num)]],
                         vars);
                       case "UpdateString":
                       return _U.replace([["string"
                                          ,A3($Dict.update,
                                          action._0._0,
                                          action._0._1,
                                          model.vars.string)]],
                         vars);}
                    _U.badCase($moduleName,
                    "between lines 122 and 141");
                 }();
                 return {ctor: "_Tuple2"
                        ,_0: _U.replace([["vars"
                                         ,newVars]],
                        model)
                        ,_1: $Effects.none};
              }();
            case "JumpToLabel":
            return A2(jumpToLabel,
              action._0,
              model);
            case "NextBlock":
            return nextBlock(model);
            case "RunEffectSet":
            return A2(handleEffectSet,
              $Basics.always(action._0),
              {ctor: "_Tuple2"
              ,_0: model
              ,_1: $Effects.none});
            case "RunEffectSetBeforeLeave":
            return {ctor: "_Tuple2"
                   ,_0: _U.replace([["queuedEffectSet"
                                    ,A2($List._op["::"],
                                    action._0,
                                    model.queuedEffectSet)]],
                   model)
                   ,_1: $Effects.none};
            case "ScrollTick":
            return function () {
                 var $ = A2($AnimationWrapper.update,
                 action._0,
                 model.scrollAnimation),
                 newScrollAnimation = $._0,
                 newEffects = $._1;
                 var scrollEffect = $Effects.task($Task.map($Basics.always($InteractiveStory$Action.NoOp))($Task.toMaybe(A2($DOMInterface.scrollElementTo,
                 {ctor: "_Tuple2"
                 ,_0: 0
                 ,_1: $Basics.round($AnimationWrapper.value(newScrollAnimation))},
                 ".interactive-story-container"))));
                 return A2(F2(function (v0,v1) {
                    return {ctor: "_Tuple2"
                           ,_0: v0
                           ,_1: v1};
                 }),
                 _U.replace([["scrollAnimation"
                             ,newScrollAnimation]],
                 model),
                 $Effects.batch(_L.fromArray([scrollEffect
                                             ,A2($Effects.map,
                                             $InteractiveStory$Action.ScrollTick,
                                             newEffects)])));
              }();
            case "SoundAction":
            return function () {
                 var $ = A2($InteractiveStory$Sound.update,
                 action._0,
                 model.soundModel),
                 newSoundModel = $._0,
                 newSoundEffects = $._1;
                 return {ctor: "_Tuple2"
                        ,_0: _U.replace([["soundModel"
                                         ,newSoundModel]],
                        model)
                        ,_1: A2($Effects.map,
                        $InteractiveStory$Action.SoundAction,
                        newSoundEffects)};
              }();
            case "StoryBlockAction":
            return function () {
                 var $ = A2($InteractiveStory$StoryBlock.update,
                 action._0,
                 model.storyTrack.selected),
                 newInstanceBlock = $._0,
                 newEffects = $._1;
                 var newStoryTrack = A2($SelectionList.updateSelected,
                 $Basics.always(newInstanceBlock),
                 model.storyTrack);
                 return {ctor: "_Tuple2"
                        ,_0: _U.replace([["storyTrack"
                                         ,newStoryTrack]],
                        model)
                        ,_1: A2($Effects.map,
                        $InteractiveStory$Action.StoryBlockAction,
                        newEffects)};
              }();
            case "UserScroll":
            return {ctor: "_Tuple2"
                   ,_0: _U.replace([["scrollData"
                                    ,action._0]],
                   model)
                   ,_1: $Effects.none};
            case "WindowResize":
            switch (action._0.ctor)
              {case "_Tuple2":
                 return {ctor: "_Tuple2"
                        ,_0: _U.replace([["windowHeight"
                                         ,action._0._1]
                                        ,["windowWidth",action._0._0]],
                        model)
                        ,_1: $Effects.none};}
              break;}
         return {ctor: "_Tuple2"
                ,_0: model
                ,_1: $Effects.none};
      }();
   });
   var handleEffectSet = F2(function (getEffectSet,
   _v97) {
      return function () {
         switch (_v97.ctor)
         {case "_Tuple2":
            return function () {
                 var $ = getEffectSet(_v97._0),
                 variableEdits = $.variableEdits,
                 soundUpdates = $.soundUpdates;
                 return applySounds(soundUpdates)(applyVariableEdits(variableEdits)({ctor: "_Tuple2"
                                                                                    ,_0: _v97._0
                                                                                    ,_1: _v97._1}));
              }();}
         _U.badCase($moduleName,
         "between lines 250 and 254");
      }();
   });
   var applySounds = F2(function (soundActions,
   _v101) {
      return function () {
         switch (_v101.ctor)
         {case "_Tuple2":
            return function (_v105) {
                 return function () {
                    switch (_v105.ctor)
                    {case "_Tuple2":
                       return {ctor: "_Tuple2"
                              ,_0: _v105._0
                              ,_1: $Effects.batch(_L.fromArray([_v101._1
                                                               ,_v105._1]))};}
                    _U.badCase($moduleName,
                    "on line 262, column 33 to 74");
                 }();
              }(A2($Basics.flip,
              update,
              _v101._0)($InteractiveStory$Action.Batch($List.map($InteractiveStory$Action.SoundAction)(soundActions))));}
         _U.badCase($moduleName,
         "between lines 258 and 262");
      }();
   });
   var applyVariableEdits = F2(function (variableEdits,
   _v109) {
      return function () {
         switch (_v109.ctor)
         {case "_Tuple2":
            return function (_v113) {
                 return function () {
                    switch (_v113.ctor)
                    {case "_Tuple2":
                       return {ctor: "_Tuple2"
                              ,_0: _v113._0
                              ,_1: $Effects.batch(_L.fromArray([_v109._1
                                                               ,_v113._1]))};}
                    _U.badCase($moduleName,
                    "on line 271, column 33 to 74");
                 }();
              }(A2($Basics.flip,
              update,
              _v109._0)($InteractiveStory$Action.Batch($List.map($InteractiveStory$Action.EditVar)(variableEdits))));}
         _U.badCase($moduleName,
         "between lines 267 and 271");
      }();
   });
   var jumpToLabel = function (label) {
      return A2(progressToNewBlockWith,
      jumpTo(label),
      false);
   };
   var progressToNewBlockWith = F3(function (progressFn,
   initialRun,
   model) {
      return A2(skipIfInitialRun,
      initialRun,
      removeRepeatBlocks(model))(A2(skipIfInitialRun,
      initialRun,
      scrollToBlock)(applyChunking(animateBlockIn(initStoryBlock(updateInstructions(handleEffectSet(function (m) {
         return m.storyTrack.selected.onEnter(m.vars);
      })(progressFn(model.vars)(A2(skipIfInitialRun,
      initialRun,
      handleEffectSet(function (m) {
         return m.storyTrack.selected.onLeave(m.vars);
      }))(processQueuedEffectSets(A2(skipIfInitialRun,
      initialRun,
      addToHistory)({ctor: "_Tuple2"
                    ,_0: model
                    ,_1: $Effects.none})))))))))));
   });
   var processQueuedEffectSets = function (_v117) {
      return function () {
         switch (_v117.ctor)
         {case "_Tuple2":
            return function () {
                 var effectSets = $List.reverse(_v117._0.queuedEffectSet);
                 var $ = A3($List.foldl,
                 F2(function (effectSet,
                 newTuple) {
                    return A2(handleEffectSet,
                    $Basics.always(effectSet),
                    newTuple);
                 }),
                 {ctor: "_Tuple2"
                 ,_0: _v117._0
                 ,_1: _v117._1},
                 effectSets),
                 newModel = $._0,
                 newEffects = $._1;
                 var newModel$ = _U.replace([["queuedEffectSet"
                                             ,_L.fromArray([])]],
                 newModel);
                 return {ctor: "_Tuple2"
                        ,_0: newModel$
                        ,_1: newEffects};
              }();}
         _U.badCase($moduleName,
         "between lines 228 and 235");
      }();
   };
   var nextBlock = A2(progressToNewBlockWith,
   moveTrackForward,
   false);
   var init = F2(function (inputList,
   audioList) {
      return function () {
         var preloadAudio = $Effects.task($Task.map($Basics.always($InteractiveStory$Action.NoOp))($Task.toMaybe($Task.sequence(A2($List.map,
         function (_v121) {
            return function () {
               switch (_v121.ctor)
               {case "_Tuple2":
                  return A2($Howler.create,
                    _v121._0,
                    _v121._1);}
               _U.badCase($moduleName,
               "on line 75, column 50 to 83");
            }();
         },
         audioList)))));
         var emptyVarModel = {_: {}
                             ,bool: $Dict.empty
                             ,num: $Dict.empty
                             ,string: $Dict.empty};
         var tail = $Maybe.withDefault(_L.fromArray([]))($List.tail(inputList));
         var head = $Maybe.withDefault($InteractiveStory$StoryBlock.emptyStoryBlock)($List.head(inputList));
         return function (_v125) {
            return function () {
               switch (_v125.ctor)
               {case "_Tuple2":
                  return {ctor: "_Tuple2"
                         ,_0: _v125._0
                         ,_1: $Effects.batch(_L.fromArray([preloadAudio
                                                          ,_v125._1]))};}
               _U.badCase($moduleName,
               "on line 96, column 34 to 78");
            }();
         }(A3(progressToNewBlockWith,
         $Basics.always($Basics.identity),
         true,
         {_: {}
         ,blockHistory: _L.fromArray([])
         ,chunkSize: 10
         ,chunkStack: _L.fromArray([])
         ,chunking: false
         ,chunkingThreshold: 5
         ,instructionText: ""
         ,queuedEffectSet: _L.fromArray([])
         ,scrollAnimation: $AnimationWrapper.empty
         ,scrollData: {_: {}
                      ,clientHeight: 0
                      ,clientWidth: 0
                      ,scrollHeight: 0
                      ,scrollLeft: 0
                      ,scrollTop: 0
                      ,scrollWidth: 0}
         ,soundModel: $InteractiveStory$Sound.emptySoundModel
         ,storyTrack: A2($SelectionList.fromList,
         head,
         tail)
         ,vars: emptyVarModel
         ,windowHeight: 0
         ,windowWidth: 0}));
      }();
   });
   var Chunk = F2(function (a,b) {
      return {_: {}
             ,blocks: b
             ,height: a};
   });
   var AnimationState = F3(function (a,
   b,
   c) {
      return {_: {}
             ,animation: c
             ,elapsedTime: b
             ,prevClockTime: a};
   });
   var Model = function (a) {
      return function (b) {
         return function (c) {
            return function (d) {
               return function (e) {
                  return function (f) {
                     return function (g) {
                        return function (h) {
                           return function (i) {
                              return function (j) {
                                 return function (k) {
                                    return function (l) {
                                       return function (m) {
                                          return function (n) {
                                             return {_: {}
                                                    ,blockHistory: d
                                                    ,chunkSize: l
                                                    ,chunkStack: e
                                                    ,chunking: f
                                                    ,chunkingThreshold: m
                                                    ,instructionText: n
                                                    ,queuedEffectSet: c
                                                    ,scrollAnimation: k
                                                    ,scrollData: j
                                                    ,soundModel: b
                                                    ,storyTrack: a
                                                    ,vars: g
                                                    ,windowHeight: h
                                                    ,windowWidth: i};
                                          };
                                       };
                                    };
                                 };
                              };
                           };
                        };
                     };
                  };
               };
            };
         };
      };
   };
   _elm.InteractiveStory.Core.values = {_op: _op
                                       ,Model: Model
                                       ,AnimationState: AnimationState
                                       ,Chunk: Chunk
                                       ,init: init
                                       ,update: update
                                       ,nextBlock: nextBlock
                                       ,jumpToLabel: jumpToLabel
                                       ,progressToNewBlockWith: progressToNewBlockWith
                                       ,updateInstructions: updateInstructions
                                       ,skipIfInitialRun: skipIfInitialRun
                                       ,processQueuedEffectSets: processQueuedEffectSets
                                       ,initStoryBlock: initStoryBlock
                                       ,addToHistory: addToHistory
                                       ,handleEffectSet: handleEffectSet
                                       ,applySounds: applySounds
                                       ,applyVariableEdits: applyVariableEdits
                                       ,scrollToBlock: scrollToBlock
                                       ,animateBlockIn: animateBlockIn
                                       ,removeRepeatBlocks: removeRepeatBlocks
                                       ,moveTrackForward: moveTrackForward
                                       ,jumpTo: jumpTo
                                       ,addAdditionalEffects: addAdditionalEffects
                                       ,applyChunking: applyChunking
                                       ,getIndexOfLabel: getIndexOfLabel
                                       ,scrollToLast: scrollToLast
                                       ,render: render
                                       ,getChunkBlockHeight: getChunkBlockHeight
                                       ,partitionChunks: partitionChunks};
   return _elm.InteractiveStory.Core.values;
};
Elm.InteractiveStory = Elm.InteractiveStory || {};
Elm.InteractiveStory.Sound = Elm.InteractiveStory.Sound || {};
Elm.InteractiveStory.Sound.make = function (_elm) {
   "use strict";
   _elm.InteractiveStory = _elm.InteractiveStory || {};
   _elm.InteractiveStory.Sound = _elm.InteractiveStory.Sound || {};
   if (_elm.InteractiveStory.Sound.values)
   return _elm.InteractiveStory.Sound.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "InteractiveStory.Sound",
   $Basics = Elm.Basics.make(_elm),
   $Debug = Elm.Debug.make(_elm),
   $Effects = Elm.Effects.make(_elm),
   $Howler = Elm.Howler.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $Task = Elm.Task.make(_elm),
   $Time = Elm.Time.make(_elm);
   var tupleToLoopModel = function (_v0) {
      return function () {
         switch (_v0.ctor)
         {case "_Tuple2": return {_: {}
                                 ,priority: _v0._0
                                 ,sound: _v0._1};}
         _U.badCase($moduleName,
         "on line 154, column 38 to 76");
      }();
   };
   var reverseTransition = function (_v4) {
      return function () {
         return {_: {}
                ,duration: _v4.duration
                ,from: _v4.to
                ,to: _v4.from};
      }();
   };
   var fade = F3(function (from,
   to,
   duration) {
      return {_: {}
             ,duration: duration
             ,from: from
             ,to: to};
   });
   var emptyTransition = {_: {}
                         ,duration: 0
                         ,from: 1
                         ,to: 1};
   var NoOp = {ctor: "NoOp"};
   var StopSound = function (a) {
      return {ctor: "StopSound"
             ,_0: a};
   };
   var PlaySFX = function (a) {
      return {ctor: "PlaySFX"
             ,_0: a};
   };
   var sfx = F3(function (label,
   sprite,
   delay) {
      return PlaySFX({_: {}
                     ,delay: delay
                     ,label: label
                     ,sprite: sprite});
   });
   var HasStoppedLoop = F2(function (a,
   b) {
      return {ctor: "HasStoppedLoop"
             ,_0: a
             ,_1: b};
   });
   var stopBGM = F4(function (maybeTransition,
   priority,
   loopType,
   soundInstance) {
      return $Effects.task($Task.map($Maybe.withDefault(NoOp))($Task.toMaybe($Task.map(function ($) {
         return HasStoppedLoop(loopType)(tupleToLoopModel(F2(function (v0,
         v1) {
            return {ctor: "_Tuple2"
                   ,_0: v0
                   ,_1: v1};
         })(priority)($)));
      })(function () {
         switch (maybeTransition.ctor)
         {case "Just":
            return A2($Task.andThen,
              A4($Howler.fade,
              maybeTransition._0.from,
              maybeTransition._0.to,
              maybeTransition._0.duration,
              soundInstance),
              function (_v8) {
                 return function () {
                    return A2($Task.andThen,
                    $Task.sleep(maybeTransition._0.duration),
                    function (_v10) {
                       return function () {
                          return $Howler.stop(soundInstance);
                       }();
                    });
                 }();
              });
            case "Nothing":
            return $Howler.stop(soundInstance);}
         _U.badCase($moduleName,
         "between lines 175 and 181");
      }()))));
   });
   var HasStartedLoop = F2(function (a,
   b) {
      return {ctor: "HasStartedLoop"
             ,_0: a
             ,_1: b};
   });
   var startBGM = F4(function (maybeTransition,
   priority,
   loopType,
   soundInstance) {
      return $Effects.task($Task.map($Maybe.withDefault(NoOp))($Task.toMaybe($Task.map(function ($) {
         return HasStartedLoop(loopType)(tupleToLoopModel(F2(function (v0,
         v1) {
            return {ctor: "_Tuple2"
                   ,_0: v0
                   ,_1: v1};
         })(priority)($)));
      })(function () {
         switch (maybeTransition.ctor)
         {case "Just":
            return A2($Task.andThen,
              A2($Task.andThen,
              $Howler.playSound(soundInstance),
              $Howler.loop(true)),
              A3($Howler.fade,
              maybeTransition._0.from,
              maybeTransition._0.to,
              maybeTransition._0.duration));
            case "Nothing":
            return A2($Task.andThen,
              $Howler.playSound(soundInstance),
              $Howler.loop(true));}
         _U.badCase($moduleName,
         "between lines 158 and 167");
      }()))));
   });
   var update = F2(function (action,
   model) {
      return function () {
         switch (action.ctor)
         {case "HasStartedLoop":
            return function () {
                 var newEffects = $Effects.none;
                 var loopModel = function () {
                    switch (action._0.ctor)
                    {case "BGM": return model.bgm;}
                    _U.badCase($moduleName,
                    "between lines 105 and 108");
                 }();
                 var sortedSounds = $List.reverse($List.sortBy(function (_) {
                    return _.priority;
                 })(A2($List._op["::"],
                 action._1,
                 loopModel.sounds)));
                 var newLoopModel = _U.replace([["sounds"
                                                ,sortedSounds]],
                 loopModel);
                 var newModel = function () {
                    switch (action._0.ctor)
                    {case "BGM":
                       return _U.replace([["bgm"
                                          ,newLoopModel]],
                         model);}
                    _U.badCase($moduleName,
                    "between lines 118 and 121");
                 }();
                 return {ctor: "_Tuple2"
                        ,_0: newModel
                        ,_1: newEffects};
              }();
            case "HasStoppedLoop":
            return function () {
                 var loopModel = function () {
                    switch (action._0.ctor)
                    {case "BGM": return model.bgm;}
                    _U.badCase($moduleName,
                    "between lines 125 and 128");
                 }();
                 var newLoopModel = _U.replace([["sounds"
                                                ,$List.filter(F2(function (x,
                                                y) {
                                                   return !_U.eq(x,y);
                                                })(action._1))(loopModel.sounds)]],
                 loopModel);
                 var newModel = function () {
                    switch (action._0.ctor)
                    {case "BGM":
                       return _U.replace([["bgm"
                                          ,newLoopModel]],
                         model);}
                    _U.badCase($moduleName,
                    "between lines 136 and 138");
                 }();
                 return {ctor: "_Tuple2"
                        ,_0: newModel
                        ,_1: $Effects.none};
              }();
            case "PlayLoop":
            return function () {
                 var loopModel = function () {
                    switch (action._1.ctor)
                    {case "BGM": return model.bgm;}
                    _U.badCase($moduleName,
                    "between lines 57 and 60");
                 }();
                 var newCount = loopModel.count + 1;
                 var newEffects = $Effects.batch(A2($List._op["::"],
                 A4(startBGM,
                 action._2,
                 loopModel.count,
                 action._1,
                 _U.replace([["soundLabel"
                             ,action._0]],
                 $Howler.emptySoundInstance)),
                 A2($List.map,
                 function (_v32) {
                    return function () {
                       return A4(stopBGM,
                       action._3,
                       _v32.priority,
                       action._1,
                       _v32.sound);
                    }();
                 },
                 loopModel.sounds)));
                 var newModel = function () {
                    switch (action._1.ctor)
                    {case "BGM":
                       return _U.replace([["bgm"
                                          ,_U.replace([["count"
                                                       ,newCount]],
                                          loopModel)]],
                         model);}
                    _U.badCase($moduleName,
                    "between lines 68 and 71");
                 }();
                 return {ctor: "_Tuple2"
                        ,_0: newModel
                        ,_1: newEffects};
              }();
            case "PlaySFX":
            return function () {
                 var sfxEffect = $Effects.task($Task.map($Basics.always(NoOp))($Task.toMaybe(A2($Task.andThen,
                 $Task.sleep(action._0.delay),
                 function (_v35) {
                    return function () {
                       return A2($Task.andThen,
                       A2($Howler.play,
                       action._0.sprite,
                       A2($Debug.log,
                       "OKAY THEN",
                       _U.replace([["soundLabel"
                                   ,action._0.label]],
                       $Howler.emptySoundInstance))),
                       $Howler.loop(false));
                    }();
                 }))));
                 return {ctor: "_Tuple2"
                        ,_0: model
                        ,_1: sfxEffect};
              }();
            case "StopLoop":
            return function () {
                 var loopModel = function () {
                    switch (action._0.ctor)
                    {case "BGM": return model.bgm;}
                    _U.badCase($moduleName,
                    "between lines 75 and 78");
                 }();
                 var newEffects = $Effects.batch(A2($List.map,
                 function (_v38) {
                    return function () {
                       return A4(stopBGM,
                       action._1,
                       _v38.priority,
                       action._0,
                       _v38.sound);
                    }();
                 },
                 loopModel.sounds));
                 return {ctor: "_Tuple2"
                        ,_0: model
                        ,_1: newEffects};
              }();
            case "StopSound":
            return function () {
                 var stopEffect = $Effects.task($Task.map($Basics.always(NoOp))($Task.toMaybe($Howler.stop(_U.replace([["soundLabel"
                                                                                                                       ,action._0]],
                 $Howler.emptySoundInstance)))));
                 return {ctor: "_Tuple2"
                        ,_0: model
                        ,_1: stopEffect};
              }();}
         return {ctor: "_Tuple2"
                ,_0: model
                ,_1: $Effects.none};
      }();
   });
   var StopLoop = F2(function (a,
   b) {
      return {ctor: "StopLoop"
             ,_0: a
             ,_1: b};
   });
   var PlayLoop = F4(function (a,
   b,
   c,
   d) {
      return {ctor: "PlayLoop"
             ,_0: a
             ,_1: b
             ,_2: c
             ,_3: d};
   });
   var BGM = {ctor: "BGM"};
   var bgm = F3(function (label,
   fadeIn,
   fadeOut) {
      return A4(PlayLoop,
      label,
      BGM,
      fadeIn,
      fadeOut);
   });
   var emptySoundModel = {_: {}
                         ,bgm: {_: {}
                               ,count: 0
                               ,sounds: _L.fromArray([])}};
   var SoundModel = function (a) {
      return {_: {},bgm: a};
   };
   var LoopModel = F2(function (a,
   b) {
      return {_: {}
             ,count: b
             ,sounds: a};
   });
   var Transition = F3(function (a,
   b,
   c) {
      return {_: {}
             ,duration: c
             ,from: a
             ,to: b};
   });
   var SFX = F3(function (a,b,c) {
      return {_: {}
             ,delay: c
             ,label: a
             ,sprite: b};
   });
   var Stop = function (a) {
      return {ctor: "Stop",_0: a};
   };
   var Pause = {ctor: "Pause"};
   var Play = F3(function (a,b,c) {
      return {ctor: "Play"
             ,_0: a
             ,_1: b
             ,_2: c};
   });
   _elm.InteractiveStory.Sound.values = {_op: _op
                                        ,Play: Play
                                        ,Pause: Pause
                                        ,Stop: Stop
                                        ,SFX: SFX
                                        ,Transition: Transition
                                        ,LoopModel: LoopModel
                                        ,SoundModel: SoundModel
                                        ,emptySoundModel: emptySoundModel
                                        ,BGM: BGM
                                        ,PlayLoop: PlayLoop
                                        ,StopLoop: StopLoop
                                        ,HasStartedLoop: HasStartedLoop
                                        ,HasStoppedLoop: HasStoppedLoop
                                        ,PlaySFX: PlaySFX
                                        ,StopSound: StopSound
                                        ,NoOp: NoOp
                                        ,bgm: bgm
                                        ,sfx: sfx
                                        ,update: update
                                        ,emptyTransition: emptyTransition
                                        ,fade: fade
                                        ,reverseTransition: reverseTransition
                                        ,tupleToLoopModel: tupleToLoopModel
                                        ,startBGM: startBGM
                                        ,stopBGM: stopBGM};
   return _elm.InteractiveStory.Sound.values;
};
Elm.InteractiveStory = Elm.InteractiveStory || {};
Elm.InteractiveStory.StoryBlock = Elm.InteractiveStory.StoryBlock || {};
Elm.InteractiveStory.StoryBlock.make = function (_elm) {
   "use strict";
   _elm.InteractiveStory = _elm.InteractiveStory || {};
   _elm.InteractiveStory.StoryBlock = _elm.InteractiveStory.StoryBlock || {};
   if (_elm.InteractiveStory.StoryBlock.values)
   return _elm.InteractiveStory.StoryBlock.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "InteractiveStory.StoryBlock",
   $AnimationWrapper = Elm.AnimationWrapper.make(_elm),
   $Basics = Elm.Basics.make(_elm),
   $Dict = Elm.Dict.make(_elm),
   $Effects = Elm.Effects.make(_elm),
   $Html = Elm.Html.make(_elm),
   $Html$Attributes = Elm.Html.Attributes.make(_elm),
   $Html$Events = Elm.Html.Events.make(_elm),
   $InteractiveStory$Action = Elm.InteractiveStory.Action.make(_elm),
   $InteractiveStory$StoryBlockAction = Elm.InteractiveStory.StoryBlockAction.make(_elm),
   $InteractiveStory$Styles$Core = Elm.InteractiveStory.Styles.Core.make(_elm),
   $InteractiveStory$VariableModel = Elm.InteractiveStory.VariableModel.make(_elm),
   $List = Elm.List.make(_elm),
   $Markdown = Elm.Markdown.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Regex = Elm.Regex.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $String = Elm.String.make(_elm);
   var choicesToHtmlList = F6(function (address,
   isActive,
   selection,
   showChosen,
   vars,
   choices) {
      return function () {
         var choiceToLi = F2(function (index,
         _v0) {
            return function () {
               return isActive ? function () {
                  var actionList = _L.fromArray([$InteractiveStory$Action.StoryBlockAction($InteractiveStory$StoryBlockAction.ChoiceConfirm)
                                                ,(_U.eq(_v0.jumpToLabel,
                                                $Maybe.Nothing) ? $InteractiveStory$Action.RunEffectSet : $InteractiveStory$Action.RunEffectSetBeforeLeave)(_v0.onChoose(vars))
                                                ,$Maybe.withDefault($InteractiveStory$Action.NoOp)(A2($Maybe.map,
                                                $InteractiveStory$Action.JumpToLabel,
                                                _v0.jumpToLabel))]);
                  return A2($Html.li,
                  _L.fromArray([$Html$Events.onClick(address)($InteractiveStory$Action.Batch(actionList))
                               ,$Html$Events.onMouseEnter(address)($InteractiveStory$Action.StoryBlockAction($InteractiveStory$StoryBlockAction.ChoiceSelect($Maybe.Just(index))))
                               ,$Html$Events.onMouseLeave(address)($InteractiveStory$Action.StoryBlockAction($InteractiveStory$StoryBlockAction.ChoiceSelect($Maybe.Nothing)))
                               ,$Html$Attributes.style(A3($InteractiveStory$Styles$Core.choiceBlockChoice,
                               _U.eq($Maybe.Just(index),
                               selection),
                               isActive,
                               _L.fromArray([])))]),
                  _L.fromArray([A2($Html.div,
                  _L.fromArray([$Html$Attributes.style($InteractiveStory$Styles$Core.noPad(_L.fromArray([])))]),
                  _L.fromArray([_v0.text(vars)]))]));
               }() : A2($Html.li,
               _L.fromArray([A2($Html$Events.onClick,
                            address,
                            $InteractiveStory$Action.NoOp)
                            ,A2($Html$Events.onMouseEnter,
                            address,
                            $InteractiveStory$Action.NoOp)
                            ,A2($Html$Events.onMouseLeave,
                            address,
                            $InteractiveStory$Action.NoOp)
                            ,$Html$Attributes.style(A3($InteractiveStory$Styles$Core.choiceBlockChoice,
                            _U.eq($Maybe.Just(index),
                            selection),
                            isActive,
                            _L.fromArray([])))]),
               _L.fromArray([_v0.text(vars)]));
            }();
         });
         return $Html.ul(_L.fromArray([]))(A2($List.indexedMap,
         choiceToLi,
         choices));
      }();
   });
   var render = F4(function (address,
   isActive,
   vars,
   block) {
      return function () {
         var animationTime = A2($AnimationWrapper.query,
         $Basics.always,
         block.animationState);
         return A2($Html.div,
         _L.fromArray([$Html$Attributes.$class("story-block")
                      ,$Html$Attributes.style($InteractiveStory$Styles$Core.animateIn(animationTime)($InteractiveStory$Styles$Core.storyBlock(_L.fromArray([]))))]),
         _L.fromArray([A3(block.contentGenerator,
                      isActive,
                      vars,
                      address)
                      ,$Maybe.withDefault($Html.text(""))(A2($Maybe.andThen,
                      block.choiceModel,
                      function (choiceModel) {
                         return $Maybe.Just(A6(choicesToHtmlList,
                         address,
                         isActive,
                         choiceModel.selection,
                         choiceModel.showChosen,
                         vars,
                         choiceModel.visibleChoices));
                      }))]));
      }();
   });
   var update = F2(function (action,
   storyBlock) {
      return function () {
         switch (action.ctor)
         {case "AnimateIn":
            return function () {
                 var $ = A2($AnimationWrapper.update,
                 $AnimationWrapper.Start($InteractiveStory$Styles$Core.storyBlockAnimation),
                 storyBlock.animationState),
                 newAnimationState = $._0,
                 newEffects = $._1;
                 var newEffects$ = A2($Effects.map,
                 $InteractiveStory$StoryBlockAction.Tick,
                 newEffects);
                 return {ctor: "_Tuple2"
                        ,_0: _U.replace([["animationState"
                                         ,newAnimationState]],
                        storyBlock)
                        ,_1: newEffects$};
              }();
            case "ChoiceConfirm":
            return function () {
                 var newChoiceModel = A2($Maybe.andThen,
                 storyBlock.choiceModel,
                 function (choiceModel) {
                    return A2($Maybe.andThen,
                    choiceModel.selection,
                    function (selection) {
                       return function () {
                          var newChoices = A2($List.indexedMap,
                          F2(function (index,choice) {
                             return _U.replace([["chosen"
                                                ,_U.eq(index,
                                                selection) || choice.chosen]],
                             choice);
                          }),
                          choiceModel.choices);
                          return $Maybe.Just(_U.replace([["choices"
                                                         ,newChoices]],
                          choiceModel));
                       }();
                    });
                 });
                 return {ctor: "_Tuple2"
                        ,_0: _U.replace([["choiceModel"
                                         ,newChoiceModel]],
                        storyBlock)
                        ,_1: $Effects.none};
              }();
            case "ChoiceSelect":
            return function () {
                 var _v6 = storyBlock.choiceModel;
                 switch (_v6.ctor)
                 {case "Just":
                    return {ctor: "_Tuple2"
                           ,_0: _U.replace([["choiceModel"
                                            ,$Maybe.Just(_U.replace([["selection"
                                                                     ,action._0]],
                                            _v6._0))]],
                           storyBlock)
                           ,_1: $Effects.none};
                    case "Nothing":
                    return {ctor: "_Tuple2"
                           ,_0: storyBlock
                           ,_1: $Effects.none};}
                 _U.badCase($moduleName,
                 "between lines 156 and 161");
              }();
            case "Init":
            return {ctor: "_Tuple2"
                   ,_0: _U.replace([["choiceModel"
                                    ,$Maybe.map(function (choiceModel) {
                                       return _U.replace([["visibleChoices"
                                                          ,$List.filter(function (_v8) {
                                                             return function () {
                                                                return _v8.showChoice(action._0);
                                                             }();
                                                          })(choiceModel.showChosen ? choiceModel.choices : A2($List.filter,
                                                          function ($) {
                                                             return $Basics.not(function (_) {
                                                                return _.chosen;
                                                             }($));
                                                          },
                                                          choiceModel.choices))]
                                                         ,["selection"
                                                          ,$Maybe.Nothing]],
                                       choiceModel);
                                    })(storyBlock.choiceModel)]],
                   storyBlock)
                   ,_1: $Effects.none};
            case "Tick":
            return function () {
                 var $ = A2($AnimationWrapper.update,
                 action._0,
                 storyBlock.animationState),
                 newAnimationState = $._0,
                 newEffects = $._1;
                 var newEffects$ = A2($Effects.map,
                 $InteractiveStory$StoryBlockAction.Tick,
                 newEffects);
                 return {ctor: "_Tuple2"
                        ,_0: _U.replace([["animationState"
                                         ,newAnimationState]],
                        storyBlock)
                        ,_1: newEffects$};
              }();}
         return {ctor: "_Tuple2"
                ,_0: storyBlock
                ,_1: $Effects.none};
      }();
   });
   var animationInProgress = function ($) {
      return $Basics.not($AnimationWrapper.isDone(function (_) {
         return _.animationState;
      }($)));
   };
   var injectVariables = F2(function (vars,
   str) {
      return function () {
         var replaceFn = function (_v10) {
            return function () {
               return $Maybe.withDefault(_v10.match)(function (str) {
                  return $Maybe.oneOf(A2($List._op["::"],
                  A2($Dict.get,str,vars.string),
                  A2($List._op["::"],
                  function ($) {
                     return $Maybe.map($Basics.toString)($Dict.get(str)($));
                  }(vars.num),
                  A2($List._op["::"],
                  function ($) {
                     return $Maybe.map($Basics.toString)($Dict.get(str)($));
                  }(vars.bool),
                  _L.fromArray([])))));
               }($String.dropRight(2)($String.dropLeft(2)(_v10.match))));
            }();
         };
         var regex = $Regex.caseInsensitive($Regex.regex("\\{\\{.*?\\}\\}"));
         var injectVars = A3($Regex.replace,
         $Regex.All,
         regex,
         replaceFn);
         return injectVars(str);
      }();
   });
   var emptyStoryBlock = {_: {}
                         ,animationState: $AnimationWrapper.empty
                         ,choiceModel: $Maybe.Nothing
                         ,contentGenerator: F3(function (_v12,
                         _v13,
                         _v14) {
                            return function () {
                               return function () {
                                  return function () {
                                     return $Html.text("");
                                  }();
                               }();
                            }();
                         })
                         ,label: $Maybe.Nothing
                         ,next: function (_v22) {
                            return function () {
                               return $InteractiveStory$Action.Continue;
                            }();
                         }
                         ,onEnter: function (_v18) {
                            return function () {
                               return $InteractiveStory$Action.emptyEffectSet;
                            }();
                         }
                         ,onLeave: function (_v20) {
                            return function () {
                               return $InteractiveStory$Action.emptyEffectSet;
                            }();
                         }};
   var contentBlock = function (str) {
      return _U.replace([["contentGenerator"
                         ,F3(function (_v24,vars,_v25) {
                            return function () {
                               return function () {
                                  return $Markdown.toHtml(A2(injectVariables,
                                  vars,
                                  str));
                               }();
                            }();
                         })]],
      emptyStoryBlock);
   };
   var conditionalTextBlock = F2(function (texts,
   $default) {
      return _U.replace([["contentGenerator"
                         ,F3(function (_v28,vars,_v29) {
                            return function () {
                               return function () {
                                  return $Maybe.withDefault($Markdown.toHtml($default))($List.head(A2($List.filterMap,
                                  function (_v32) {
                                     return function () {
                                        switch (_v32.ctor)
                                        {case "_Tuple4":
                                           return _U.eq(A2($Dict.get,
                                             _v32._1,
                                             _v32._0(vars)),
                                             $Maybe.Just(_v32._2)) ? $Maybe.Just($Markdown.toHtml(A2(injectVariables,
                                             vars,
                                             _v32._3))) : $Maybe.Nothing;}
                                        _U.badCase($moduleName,
                                        "on line 109, column 17 to 136");
                                     }();
                                  },
                                  texts)));
                               }();
                            }();
                         })]],
      emptyStoryBlock);
   });
   var StoryBlock = F7(function (a,
   b,
   c,
   d,
   e,
   f,
   g) {
      return {_: {}
             ,animationState: g
             ,choiceModel: f
             ,contentGenerator: a
             ,label: e
             ,next: d
             ,onEnter: b
             ,onLeave: c};
   });
   var emptyChoiceModel = {_: {}
                          ,choices: _L.fromArray([])
                          ,selection: $Maybe.Nothing
                          ,showChosen: true
                          ,visibleChoices: _L.fromArray([])};
   var ChoiceModel = F4(function (a,
   b,
   c,
   d) {
      return {_: {}
             ,choices: b
             ,selection: a
             ,showChosen: d
             ,visibleChoices: c};
   });
   var emptyChoice = {_: {}
                     ,chosen: false
                     ,jumpToLabel: $Maybe.Nothing
                     ,onChoose: function (_v40) {
                        return function () {
                           return $InteractiveStory$Action.emptyEffectSet;
                        }();
                     }
                     ,showChoice: function (_v42) {
                        return function () {
                           return true;
                        }();
                     }
                     ,text: function (_v38) {
                        return function () {
                           return $Html.text("");
                        }();
                     }};
   var choiceBlock = F3(function (str,
   choices,
   showChosen) {
      return _U.replace([["contentGenerator"
                         ,F3(function (_v44,vars,_v45) {
                            return function () {
                               return function () {
                                  return $Markdown.toHtml(A2(injectVariables,
                                  vars,
                                  str));
                               }();
                            }();
                         })]
                        ,["next"
                         ,function (_v48) {
                            return function () {
                               return $InteractiveStory$Action.Stop;
                            }();
                         }]
                        ,["choiceModel"
                         ,$Maybe.Just(_U.replace([["choices"
                                                  ,A2($List.map,
                                                  function (_v50) {
                                                     return function () {
                                                        switch (_v50.ctor)
                                                        {case "_Tuple4":
                                                           return _U.replace([["text"
                                                                              ,function (vars) {
                                                                                 return $Markdown.toHtml(A2(injectVariables,
                                                                                 vars,
                                                                                 _v50._0));
                                                                              }]
                                                                             ,["jumpToLabel"
                                                                              ,_v50._1]
                                                                             ,["onChoose"
                                                                              ,A2($Maybe.withDefault,
                                                                              $Basics.always($InteractiveStory$Action.emptyEffectSet),
                                                                              _v50._2)]
                                                                             ,["showChoice"
                                                                              ,A2($Maybe.withDefault,
                                                                              $Basics.always(true),
                                                                              _v50._3)]],
                                                             emptyChoice);}
                                                        _U.badCase($moduleName,
                                                        "between lines 124 and 129");
                                                     }();
                                                  },
                                                  choices)]
                                                 ,["showChosen",showChosen]],
                         emptyChoiceModel))]],
      emptyStoryBlock);
   });
   var Choice = F5(function (a,
   b,
   c,
   d,
   e) {
      return {_: {}
             ,chosen: e
             ,jumpToLabel: b
             ,onChoose: c
             ,showChoice: d
             ,text: a};
   });
   _elm.InteractiveStory.StoryBlock.values = {_op: _op
                                             ,Choice: Choice
                                             ,emptyChoice: emptyChoice
                                             ,ChoiceModel: ChoiceModel
                                             ,emptyChoiceModel: emptyChoiceModel
                                             ,StoryBlock: StoryBlock
                                             ,emptyStoryBlock: emptyStoryBlock
                                             ,injectVariables: injectVariables
                                             ,animationInProgress: animationInProgress
                                             ,contentBlock: contentBlock
                                             ,conditionalTextBlock: conditionalTextBlock
                                             ,choiceBlock: choiceBlock
                                             ,update: update
                                             ,render: render
                                             ,choicesToHtmlList: choicesToHtmlList};
   return _elm.InteractiveStory.StoryBlock.values;
};
Elm.InteractiveStory = Elm.InteractiveStory || {};
Elm.InteractiveStory.StoryBlockAction = Elm.InteractiveStory.StoryBlockAction || {};
Elm.InteractiveStory.StoryBlockAction.make = function (_elm) {
   "use strict";
   _elm.InteractiveStory = _elm.InteractiveStory || {};
   _elm.InteractiveStory.StoryBlockAction = _elm.InteractiveStory.StoryBlockAction || {};
   if (_elm.InteractiveStory.StoryBlockAction.values)
   return _elm.InteractiveStory.StoryBlockAction.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "InteractiveStory.StoryBlockAction",
   $AnimationWrapper = Elm.AnimationWrapper.make(_elm),
   $Basics = Elm.Basics.make(_elm),
   $InteractiveStory$VariableModel = Elm.InteractiveStory.VariableModel.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var Init = function (a) {
      return {ctor: "Init",_0: a};
   };
   var ChoiceConfirm = {ctor: "ChoiceConfirm"};
   var ChoiceSelect = function (a) {
      return {ctor: "ChoiceSelect"
             ,_0: a};
   };
   var Tick = function (a) {
      return {ctor: "Tick",_0: a};
   };
   var AnimateIn = {ctor: "AnimateIn"};
   _elm.InteractiveStory.StoryBlockAction.values = {_op: _op
                                                   ,AnimateIn: AnimateIn
                                                   ,Tick: Tick
                                                   ,ChoiceSelect: ChoiceSelect
                                                   ,ChoiceConfirm: ChoiceConfirm
                                                   ,Init: Init};
   return _elm.InteractiveStory.StoryBlockAction.values;
};
Elm.InteractiveStory = Elm.InteractiveStory || {};
Elm.InteractiveStory.Styles = Elm.InteractiveStory.Styles || {};
Elm.InteractiveStory.Styles.Core = Elm.InteractiveStory.Styles.Core || {};
Elm.InteractiveStory.Styles.Core.make = function (_elm) {
   "use strict";
   _elm.InteractiveStory = _elm.InteractiveStory || {};
   _elm.InteractiveStory.Styles = _elm.InteractiveStory.Styles || {};
   _elm.InteractiveStory.Styles.Core = _elm.InteractiveStory.Styles.Core || {};
   if (_elm.InteractiveStory.Styles.Core.values)
   return _elm.InteractiveStory.Styles.Core.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "InteractiveStory.Styles.Core",
   $Animation = Elm.Animation.make(_elm),
   $Basics = Elm.Basics.make(_elm),
   $Color = Elm.Color.make(_elm),
   $Css = Elm.Css.make(_elm),
   $Css$Background = Elm.Css.Background.make(_elm),
   $Css$Border = Elm.Css.Border.make(_elm),
   $Css$Border$Style = Elm.Css.Border.Style.make(_elm),
   $Css$Cursor = Elm.Css.Cursor.make(_elm),
   $Css$Dimension = Elm.Css.Dimension.make(_elm),
   $Css$Display = Elm.Css.Display.make(_elm),
   $Css$Font = Elm.Css.Font.make(_elm),
   $Css$Gradient = Elm.Css.Gradient.make(_elm),
   $Css$ListStyle = Elm.Css.ListStyle.make(_elm),
   $Css$Margin = Elm.Css.Margin.make(_elm),
   $Css$Padding = Elm.Css.Padding.make(_elm),
   $Css$Position = Elm.Css.Position.make(_elm),
   $Css$Text = Elm.Css.Text.make(_elm),
   $Html$Events$Extra = Elm.Html.Events.Extra.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $Time = Elm.Time.make(_elm);
   var storyBlockAnimation = $Animation.duration(0.5 * $Time.second)($Animation.to(1)($Animation.from(0)($Animation.animation(0))));
   var topBarAnimation2 = $Animation.delay(50)($Animation.duration(350)($Animation.to(0)($Animation.from(1)($Animation.animation(0)))));
   var topBarAnimationFrom = 200;
   var topBarAnimation = $Animation.delay(50)($Animation.duration(350)($Animation.to(75)($Animation.from(topBarAnimationFrom)($Animation.animation(0)))));
   var noPad = A4($Css$Padding.all,
   0,
   0,
   0,
   0);
   var imgList = function ($) {
      return A4($Css$Margin.all,
      0,
      0,
      0,
      0)($Css$Text.align($Css$Text.Right)($Css$ListStyle.bulletType($Css$ListStyle.None)($)));
   };
   var choiceBlockChoice = F3(function (selected,
   isActive,
   styles) {
      return function () {
         var bgColor = isActive ? selected ? function ($) {
            return A2($Css$Gradient.linear,
            0,
            _L.fromArray([A4($Color.rgba,
                         91,
                         34,
                         1,
                         0)
                         ,A4($Color.rgba,91,34,1,1)
                         ,A4($Color.rgba,
                         0,
                         0,
                         0,
                         0)]))($Css$ListStyle.image("assets/images/pumpkin-bullet.png")($Css$Text.color(A4($Color.rgba,
            255,
            255,
            255,
            1))($)));
         } : $Css$Text.color(A4($Color.rgba,
         200,
         200,
         200,
         0.9)) : selected ? function ($) {
            return A2($Css$Gradient.linear,
            0,
            _L.fromArray([A4($Color.rgba,
                         0,
                         0,
                         0,
                         0)
                         ,A4($Color.rgba,91,34,1,1)
                         ,A4($Color.rgba,
                         0,
                         0,
                         0,
                         0)]))($Css$ListStyle.image("assets/images/pumpkin-bullet-2.png")($Css$Text.color(A4($Color.rgba,
            200,
            200,
            200,
            1))($)));
         } : function ($) {
            return $Css$ListStyle.image("assets/images/empty-bullet.png")($Css$Text.color(A4($Color.rgba,
            200,
            200,
            200,
            0.4))($));
         };
         return bgColor($Css$ListStyle.image("assets/images/pumpkin-bullet-2.png")($Css$Cursor.cursor(isActive ? $Css$Cursor.Pointer : $Css$Cursor.Default)(A4($Css$Padding.all,
         0,
         20,
         0,
         20)(A4($Css$Border.radius,
         2,
         2,
         2,
         2)(styles)))));
      }();
   });
   var spacer = F2(function (windowHeight,
   styles) {
      return $Css$Dimension.height(windowHeight)(styles);
   });
   var animateIn = F2(function (time,
   styles) {
      return A2($Css.style,
      "opacity",
      $Basics.toString(A2($Animation.animate,
      time,
      storyBlockAnimation)))($Css$Position.position($Css$Position.Relative)(styles));
   });
   var link = $Css$Text.color(A4($Color.rgba,
   135,
   50,
   0,
   1));
   var storyBlock = function (styles) {
      return A4($Css$Border.radius,
      5,
      5,
      5,
      5)($Css$Border.style($Css$Border$Style.Solid)(A4($Css$Border.width,
      1,
      1,
      1,
      1)($Css$Border.color(A4($Color.rgba,
      0,
      0,
      0,
      1))(A4($Css$Padding.all,
      5,
      15,
      5,
      15)(A2($Css$Gradient.linear,
      90,
      _L.fromArray([A4($Color.rgba,
                   0,
                   0,
                   0,
                   0.6)
                   ,A4($Color.rgba,
                   0,
                   0,
                   0,
                   0.3)]))($Css$Dimension.maxWidth(600)($Css$Font.size(20)($Css$Text.color(A4($Color.rgba,
      200,
      200,
      200,
      1))(A2($Css.style,
      "margin",
      "15px auto")(styles))))))))));
   };
   var fixed = function (styles) {
      return $Css$Position.top(0)($Css$Position.position($Css$Position.Fixed)(styles));
   };
   var instructionBlock = function (_v0) {
      return function () {
         return function ($) {
            return $Css$Position.zIndex(100)($Css$Text.align($Css$Text.Center)($Css$Position.right(20)(fixed($Css$Font.size(18)($Css$Background.color(A4($Color.rgba,
            0,
            0,
            0,
            0.5))($Css$Text.color(A4($Color.rgba,
            255,
            255,
            255,
            0.7))($)))))));
         };
      }();
   };
   var linkArea = function ($) {
      return $Css$Background.color(A4($Color.rgba,
      0,
      0,
      0,
      0))($Css$Position.top(10)(instructionBlock({_: {}
                                                 ,scrollTop: 0})($)));
   };
   var topBarImage = A2($Css.style,
   "height",
   "100%");
   var topBarBanner = F3(function (_v2,
   windowWidth,
   styles) {
      return function () {
         return $Css$Margin.left(($Basics.toFloat(windowWidth) / 2 - 500) * A2($Animation.animate,
         $Basics.toFloat(_v2.scrollTop),
         topBarAnimation2))($Css$Display.display($Css$Display.Block)($Css$Dimension.height(A2($Animation.animate,
         $Basics.toFloat(_v2.scrollTop),
         topBarAnimation))(styles)));
      }();
   });
   var topBar = F3(function (_v4,
   windowWidth,
   styles) {
      return function () {
         return function () {
            var bgOpacity = (1 - A2($Animation.animate,
            $Basics.toFloat(_v4.scrollTop),
            topBarAnimation) / 200) * 1.7;
            return $Css$Position.zIndex(10)($Css$Border.color(A4($Color.rgba,
            0,
            0,
            0,
            1))(A2($Css$Gradient.linear,
            90,
            _L.fromArray([A4($Color.rgba,
                         0,
                         0,
                         0,
                         bgOpacity * 0)
                         ,A4($Color.rgba,
                         0,
                         0,
                         0,
                         bgOpacity * 0.7)
                         ,A4($Color.rgba,
                         0,
                         0,
                         0,
                         bgOpacity * 0.9)
                         ,A4($Color.rgba,
                         0,
                         0,
                         0,
                         bgOpacity)]))($Css$Dimension.width(windowWidth - 17)($Css$Dimension.height(A2($Animation.animate,
            $Basics.toFloat(_v4.scrollTop),
            topBarAnimation))(styles)))));
         }();
      }();
   });
   var bodyDiv = function (styles) {
      return A2($Css$Gradient.linear,
      90,
      _L.fromArray([A4($Color.rgba,
                   255,
                   94,
                   0,
                   1)
                   ,A4($Color.rgba,91,34,1,1)
                   ,A4($Color.rgba,
                   0,
                   0,
                   0,
                   1)]))(styles);
   };
   var fullscreen = function ($) {
      return $Css$Position.overflow($Css$Position.AutoOverflow)($Css$Position.bottom(0)($Css$Position.right(0)($Css$Position.left(0)($Css$Position.top(0)($Css$Position.position($Css$Position.Absolute)($))))));
   };
   _elm.InteractiveStory.Styles.Core.values = {_op: _op
                                              ,fullscreen: fullscreen
                                              ,bodyDiv: bodyDiv
                                              ,topBar: topBar
                                              ,topBarBanner: topBarBanner
                                              ,topBarImage: topBarImage
                                              ,fixed: fixed
                                              ,storyBlock: storyBlock
                                              ,instructionBlock: instructionBlock
                                              ,linkArea: linkArea
                                              ,link: link
                                              ,animateIn: animateIn
                                              ,spacer: spacer
                                              ,choiceBlockChoice: choiceBlockChoice
                                              ,imgList: imgList
                                              ,noPad: noPad
                                              ,topBarAnimationFrom: topBarAnimationFrom
                                              ,topBarAnimation: topBarAnimation
                                              ,topBarAnimation2: topBarAnimation2
                                              ,storyBlockAnimation: storyBlockAnimation};
   return _elm.InteractiveStory.Styles.Core.values;
};
Elm.InteractiveStory = Elm.InteractiveStory || {};
Elm.InteractiveStory.VariableModel = Elm.InteractiveStory.VariableModel || {};
Elm.InteractiveStory.VariableModel.make = function (_elm) {
   "use strict";
   _elm.InteractiveStory = _elm.InteractiveStory || {};
   _elm.InteractiveStory.VariableModel = _elm.InteractiveStory.VariableModel || {};
   if (_elm.InteractiveStory.VariableModel.values)
   return _elm.InteractiveStory.VariableModel.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "InteractiveStory.VariableModel",
   $Basics = Elm.Basics.make(_elm),
   $Dict = Elm.Dict.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var getBool = F3(function (key,
   $default,
   vars) {
      return $Maybe.withDefault($default)(A2($Dict.get,
      key,
      vars.bool));
   });
   var getNum = F3(function (key,
   $default,
   vars) {
      return $Maybe.withDefault($default)(A2($Dict.get,
      key,
      vars.num));
   });
   var getString = F3(function (key,
   $default,
   vars) {
      return $Maybe.withDefault($default)(A2($Dict.get,
      key,
      vars.string));
   });
   var VariableModel = F3(function (a,
   b,
   c) {
      return {_: {}
             ,bool: c
             ,num: b
             ,string: a};
   });
   _elm.InteractiveStory.VariableModel.values = {_op: _op
                                                ,VariableModel: VariableModel
                                                ,getString: getString
                                                ,getNum: getNum
                                                ,getBool: getBool};
   return _elm.InteractiveStory.VariableModel.values;
};
Elm.Json = Elm.Json || {};
Elm.Json.Decode = Elm.Json.Decode || {};
Elm.Json.Decode.make = function (_elm) {
   "use strict";
   _elm.Json = _elm.Json || {};
   _elm.Json.Decode = _elm.Json.Decode || {};
   if (_elm.Json.Decode.values)
   return _elm.Json.Decode.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Json.Decode",
   $Array = Elm.Array.make(_elm),
   $Dict = Elm.Dict.make(_elm),
   $Json$Encode = Elm.Json.Encode.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Json = Elm.Native.Json.make(_elm),
   $Result = Elm.Result.make(_elm);
   var tuple8 = $Native$Json.decodeTuple8;
   var tuple7 = $Native$Json.decodeTuple7;
   var tuple6 = $Native$Json.decodeTuple6;
   var tuple5 = $Native$Json.decodeTuple5;
   var tuple4 = $Native$Json.decodeTuple4;
   var tuple3 = $Native$Json.decodeTuple3;
   var tuple2 = $Native$Json.decodeTuple2;
   var tuple1 = $Native$Json.decodeTuple1;
   var succeed = $Native$Json.succeed;
   var fail = $Native$Json.fail;
   var andThen = $Native$Json.andThen;
   var customDecoder = $Native$Json.customDecoder;
   var decodeValue = $Native$Json.runDecoderValue;
   var value = $Native$Json.decodeValue;
   var maybe = $Native$Json.decodeMaybe;
   var $null = $Native$Json.decodeNull;
   var array = $Native$Json.decodeArray;
   var list = $Native$Json.decodeList;
   var bool = $Native$Json.decodeBool;
   var $int = $Native$Json.decodeInt;
   var $float = $Native$Json.decodeFloat;
   var string = $Native$Json.decodeString;
   var oneOf = $Native$Json.oneOf;
   var keyValuePairs = $Native$Json.decodeKeyValuePairs;
   var object8 = $Native$Json.decodeObject8;
   var object7 = $Native$Json.decodeObject7;
   var object6 = $Native$Json.decodeObject6;
   var object5 = $Native$Json.decodeObject5;
   var object4 = $Native$Json.decodeObject4;
   var object3 = $Native$Json.decodeObject3;
   var object2 = $Native$Json.decodeObject2;
   var object1 = $Native$Json.decodeObject1;
   _op[":="] = $Native$Json.decodeField;
   var at = F2(function (fields,
   decoder) {
      return A3($List.foldr,
      F2(function (x,y) {
         return A2(_op[":="],x,y);
      }),
      decoder,
      fields);
   });
   var decodeString = $Native$Json.runDecoderString;
   var map = $Native$Json.decodeObject1;
   var dict = function (decoder) {
      return A2(map,
      $Dict.fromList,
      keyValuePairs(decoder));
   };
   var Decoder = {ctor: "Decoder"};
   _elm.Json.Decode.values = {_op: _op
                             ,decodeString: decodeString
                             ,decodeValue: decodeValue
                             ,string: string
                             ,$int: $int
                             ,$float: $float
                             ,bool: bool
                             ,$null: $null
                             ,list: list
                             ,array: array
                             ,tuple1: tuple1
                             ,tuple2: tuple2
                             ,tuple3: tuple3
                             ,tuple4: tuple4
                             ,tuple5: tuple5
                             ,tuple6: tuple6
                             ,tuple7: tuple7
                             ,tuple8: tuple8
                             ,at: at
                             ,object1: object1
                             ,object2: object2
                             ,object3: object3
                             ,object4: object4
                             ,object5: object5
                             ,object6: object6
                             ,object7: object7
                             ,object8: object8
                             ,keyValuePairs: keyValuePairs
                             ,dict: dict
                             ,maybe: maybe
                             ,oneOf: oneOf
                             ,map: map
                             ,fail: fail
                             ,succeed: succeed
                             ,andThen: andThen
                             ,value: value
                             ,customDecoder: customDecoder
                             ,Decoder: Decoder};
   return _elm.Json.Decode.values;
};
Elm.Json = Elm.Json || {};
Elm.Json.Encode = Elm.Json.Encode || {};
Elm.Json.Encode.make = function (_elm) {
   "use strict";
   _elm.Json = _elm.Json || {};
   _elm.Json.Encode = _elm.Json.Encode || {};
   if (_elm.Json.Encode.values)
   return _elm.Json.Encode.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Json.Encode",
   $Array = Elm.Array.make(_elm),
   $Native$Json = Elm.Native.Json.make(_elm);
   var list = $Native$Json.encodeList;
   var array = $Native$Json.encodeArray;
   var object = $Native$Json.encodeObject;
   var $null = $Native$Json.encodeNull;
   var bool = $Native$Json.identity;
   var $float = $Native$Json.identity;
   var $int = $Native$Json.identity;
   var string = $Native$Json.identity;
   var encode = $Native$Json.encode;
   var Value = {ctor: "Value"};
   _elm.Json.Encode.values = {_op: _op
                             ,encode: encode
                             ,string: string
                             ,$int: $int
                             ,$float: $float
                             ,bool: bool
                             ,$null: $null
                             ,list: list
                             ,array: array
                             ,object: object
                             ,Value: Value};
   return _elm.Json.Encode.values;
};
Elm.List = Elm.List || {};
Elm.List.make = function (_elm) {
   "use strict";
   _elm.List = _elm.List || {};
   if (_elm.List.values)
   return _elm.List.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "List",
   $Basics = Elm.Basics.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$List = Elm.Native.List.make(_elm);
   var sortWith = $Native$List.sortWith;
   var sortBy = $Native$List.sortBy;
   var sort = function (xs) {
      return A2(sortBy,
      $Basics.identity,
      xs);
   };
   var repeat = $Native$List.repeat;
   var drop = $Native$List.drop;
   var take = $Native$List.take;
   var map5 = $Native$List.map5;
   var map4 = $Native$List.map4;
   var map3 = $Native$List.map3;
   var map2 = $Native$List.map2;
   var any = $Native$List.any;
   var all = F2(function (pred,
   xs) {
      return $Basics.not(A2(any,
      function ($) {
         return $Basics.not(pred($));
      },
      xs));
   });
   var foldr = $Native$List.foldr;
   var foldl = $Native$List.foldl;
   var length = function (xs) {
      return A3(foldl,
      F2(function (_v0,i) {
         return function () {
            return i + 1;
         }();
      }),
      0,
      xs);
   };
   var sum = function (numbers) {
      return A3(foldl,
      F2(function (x,y) {
         return x + y;
      }),
      0,
      numbers);
   };
   var product = function (numbers) {
      return A3(foldl,
      F2(function (x,y) {
         return x * y;
      }),
      1,
      numbers);
   };
   var maximum = function (list) {
      return function () {
         switch (list.ctor)
         {case "::":
            return $Maybe.Just(A3(foldl,
              $Basics.max,
              list._0,
              list._1));}
         return $Maybe.Nothing;
      }();
   };
   var minimum = function (list) {
      return function () {
         switch (list.ctor)
         {case "::":
            return $Maybe.Just(A3(foldl,
              $Basics.min,
              list._0,
              list._1));}
         return $Maybe.Nothing;
      }();
   };
   var indexedMap = F2(function (f,
   xs) {
      return A3(map2,
      f,
      _L.range(0,length(xs) - 1),
      xs);
   });
   var member = F2(function (x,
   xs) {
      return A2(any,
      function (a) {
         return _U.eq(a,x);
      },
      xs);
   });
   var isEmpty = function (xs) {
      return function () {
         switch (xs.ctor)
         {case "[]": return true;}
         return false;
      }();
   };
   var tail = function (list) {
      return function () {
         switch (list.ctor)
         {case "::":
            return $Maybe.Just(list._1);
            case "[]":
            return $Maybe.Nothing;}
         _U.badCase($moduleName,
         "between lines 87 and 89");
      }();
   };
   var head = function (list) {
      return function () {
         switch (list.ctor)
         {case "::":
            return $Maybe.Just(list._0);
            case "[]":
            return $Maybe.Nothing;}
         _U.badCase($moduleName,
         "between lines 75 and 77");
      }();
   };
   _op["::"] = $Native$List.cons;
   var map = F2(function (f,xs) {
      return A3(foldr,
      F2(function (x,acc) {
         return A2(_op["::"],
         f(x),
         acc);
      }),
      _L.fromArray([]),
      xs);
   });
   var filter = F2(function (pred,
   xs) {
      return function () {
         var conditionalCons = F2(function (x,
         xs$) {
            return pred(x) ? A2(_op["::"],
            x,
            xs$) : xs$;
         });
         return A3(foldr,
         conditionalCons,
         _L.fromArray([]),
         xs);
      }();
   });
   var maybeCons = F3(function (f,
   mx,
   xs) {
      return function () {
         var _v15 = f(mx);
         switch (_v15.ctor)
         {case "Just":
            return A2(_op["::"],_v15._0,xs);
            case "Nothing": return xs;}
         _U.badCase($moduleName,
         "between lines 179 and 181");
      }();
   });
   var filterMap = F2(function (f,
   xs) {
      return A3(foldr,
      maybeCons(f),
      _L.fromArray([]),
      xs);
   });
   var reverse = function (list) {
      return A3(foldl,
      F2(function (x,y) {
         return A2(_op["::"],x,y);
      }),
      _L.fromArray([]),
      list);
   };
   var scanl = F3(function (f,
   b,
   xs) {
      return function () {
         var scan1 = F2(function (x,
         accAcc) {
            return function () {
               switch (accAcc.ctor)
               {case "::": return A2(_op["::"],
                    A2(f,x,accAcc._0),
                    accAcc);
                  case "[]":
                  return _L.fromArray([]);}
               _U.badCase($moduleName,
               "between lines 148 and 151");
            }();
         });
         return reverse(A3(foldl,
         scan1,
         _L.fromArray([b]),
         xs));
      }();
   });
   var append = F2(function (xs,
   ys) {
      return function () {
         switch (ys.ctor)
         {case "[]": return xs;}
         return A3(foldr,
         F2(function (x,y) {
            return A2(_op["::"],x,y);
         }),
         ys,
         xs);
      }();
   });
   var concat = function (lists) {
      return A3(foldr,
      append,
      _L.fromArray([]),
      lists);
   };
   var concatMap = F2(function (f,
   list) {
      return concat(A2(map,
      f,
      list));
   });
   var partition = F2(function (pred,
   list) {
      return function () {
         var step = F2(function (x,
         _v21) {
            return function () {
               switch (_v21.ctor)
               {case "_Tuple2":
                  return pred(x) ? {ctor: "_Tuple2"
                                   ,_0: A2(_op["::"],x,_v21._0)
                                   ,_1: _v21._1} : {ctor: "_Tuple2"
                                                   ,_0: _v21._0
                                                   ,_1: A2(_op["::"],
                                                   x,
                                                   _v21._1)};}
               _U.badCase($moduleName,
               "between lines 301 and 303");
            }();
         });
         return A3(foldr,
         step,
         {ctor: "_Tuple2"
         ,_0: _L.fromArray([])
         ,_1: _L.fromArray([])},
         list);
      }();
   });
   var unzip = function (pairs) {
      return function () {
         var step = F2(function (_v25,
         _v26) {
            return function () {
               switch (_v26.ctor)
               {case "_Tuple2":
                  return function () {
                       switch (_v25.ctor)
                       {case "_Tuple2":
                          return {ctor: "_Tuple2"
                                 ,_0: A2(_op["::"],
                                 _v25._0,
                                 _v26._0)
                                 ,_1: A2(_op["::"],
                                 _v25._1,
                                 _v26._1)};}
                       _U.badCase($moduleName,
                       "on line 339, column 12 to 28");
                    }();}
               _U.badCase($moduleName,
               "on line 339, column 12 to 28");
            }();
         });
         return A3(foldr,
         step,
         {ctor: "_Tuple2"
         ,_0: _L.fromArray([])
         ,_1: _L.fromArray([])},
         pairs);
      }();
   };
   var intersperse = F2(function (sep,
   xs) {
      return function () {
         switch (xs.ctor)
         {case "::": return function () {
                 var step = F2(function (x,
                 rest) {
                    return A2(_op["::"],
                    sep,
                    A2(_op["::"],x,rest));
                 });
                 var spersed = A3(foldr,
                 step,
                 _L.fromArray([]),
                 xs._1);
                 return A2(_op["::"],
                 xs._0,
                 spersed);
              }();
            case "[]":
            return _L.fromArray([]);}
         _U.badCase($moduleName,
         "between lines 350 and 356");
      }();
   });
   _elm.List.values = {_op: _op
                      ,isEmpty: isEmpty
                      ,length: length
                      ,reverse: reverse
                      ,member: member
                      ,head: head
                      ,tail: tail
                      ,filter: filter
                      ,take: take
                      ,drop: drop
                      ,repeat: repeat
                      ,append: append
                      ,concat: concat
                      ,intersperse: intersperse
                      ,partition: partition
                      ,unzip: unzip
                      ,map: map
                      ,map2: map2
                      ,map3: map3
                      ,map4: map4
                      ,map5: map5
                      ,filterMap: filterMap
                      ,concatMap: concatMap
                      ,indexedMap: indexedMap
                      ,foldr: foldr
                      ,foldl: foldl
                      ,sum: sum
                      ,product: product
                      ,maximum: maximum
                      ,minimum: minimum
                      ,all: all
                      ,any: any
                      ,scanl: scanl
                      ,sort: sort
                      ,sortBy: sortBy
                      ,sortWith: sortWith};
   return _elm.List.values;
};
Elm.List = Elm.List || {};
Elm.List.Extra = Elm.List.Extra || {};
Elm.List.Extra.make = function (_elm) {
   "use strict";
   _elm.List = _elm.List || {};
   _elm.List.Extra = _elm.List.Extra || {};
   if (_elm.List.Extra.values)
   return _elm.List.Extra.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "List.Extra",
   $Basics = Elm.Basics.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Set = Elm.Set.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var zip5 = $List.map5(F5(function (v0,
   v1,
   v2,
   v3,
   v4) {
      return {ctor: "_Tuple5"
             ,_0: v0
             ,_1: v1
             ,_2: v2
             ,_3: v3
             ,_4: v4};
   }));
   var zip4 = $List.map4(F4(function (v0,
   v1,
   v2,
   v3) {
      return {ctor: "_Tuple4"
             ,_0: v0
             ,_1: v1
             ,_2: v2
             ,_3: v3};
   }));
   var zip3 = $List.map3(F3(function (v0,
   v1,
   v2) {
      return {ctor: "_Tuple3"
             ,_0: v0
             ,_1: v1
             ,_2: v2};
   }));
   var zip = $List.map2(F2(function (v0,
   v1) {
      return {ctor: "_Tuple2"
             ,_0: v0
             ,_1: v1};
   }));
   var isPrefixOf = function (prefix) {
      return function ($) {
         return $List.all($Basics.identity)(A2($List.map2,
         F2(function (x,y) {
            return _U.eq(x,y);
         }),
         prefix)($));
      };
   };
   var isSuffixOf = F2(function (suffix,
   xs) {
      return A2(isPrefixOf,
      $List.reverse(suffix),
      $List.reverse(xs));
   });
   var selectSplit = function (xs) {
      return function () {
         switch (xs.ctor)
         {case "::":
            return A2($List._op["::"],
              {ctor: "_Tuple3"
              ,_0: _L.fromArray([])
              ,_1: xs._0
              ,_2: xs._1},
              A2($List.map,
              function (_v3) {
                 return function () {
                    switch (_v3.ctor)
                    {case "_Tuple3":
                       return {ctor: "_Tuple3"
                              ,_0: A2($List._op["::"],
                              xs._0,
                              _v3._0)
                              ,_1: _v3._1
                              ,_2: _v3._2};}
                    _U.badCase($moduleName,
                    "on line 541, column 49 to 61");
                 }();
              },
              selectSplit(xs._1)));
            case "[]":
            return _L.fromArray([]);}
         _U.badCase($moduleName,
         "between lines 539 and 541");
      }();
   };
   var select = function (xs) {
      return function () {
         switch (xs.ctor)
         {case "::":
            return A2($List._op["::"],
              {ctor: "_Tuple2"
              ,_0: xs._0
              ,_1: xs._1},
              A2($List.map,
              function (_v11) {
                 return function () {
                    switch (_v11.ctor)
                    {case "_Tuple2":
                       return {ctor: "_Tuple2"
                              ,_0: _v11._0
                              ,_1: A2($List._op["::"],
                              xs._0,
                              _v11._1)};}
                    _U.badCase($moduleName,
                    "on line 531, column 41 to 48");
                 }();
              },
              select(xs._1)));
            case "[]":
            return _L.fromArray([]);}
         _U.badCase($moduleName,
         "between lines 529 and 531");
      }();
   };
   var tails = A2($List.foldr,
   F2(function (e,_v15) {
      return function () {
         switch (_v15.ctor)
         {case "::":
            return A2($List._op["::"],
              A2($List._op["::"],e,_v15._0),
              A2($List._op["::"],
              _v15._0,
              _v15._1));}
         _U.badCase($moduleName,
         "on line 521, column 31 to 43");
      }();
   }),
   _L.fromArray([_L.fromArray([])]));
   var isInfixOf = F2(function (infix,
   xs) {
      return A2($List.any,
      isPrefixOf(infix),
      tails(xs));
   });
   var inits = A2($List.foldr,
   F2(function (e,acc) {
      return A2($List._op["::"],
      _L.fromArray([]),
      A2($List.map,
      F2(function (x,y) {
         return A2($List._op["::"],
         x,
         y);
      })(e),
      acc));
   }),
   _L.fromArray([_L.fromArray([])]));
   var groupByTransitive = F2(function (cmp,
   xs$) {
      return function () {
         switch (xs$.ctor)
         {case "::": switch (xs$._1.ctor)
              {case "::": return function () {
                      var _ = A2(groupByTransitive,
                      cmp,
                      xs$._1);
                      var r = function () {
                         switch (_.ctor)
                         {case "::": return _;}
                         _U.badCase($moduleName,
                         "on line 504, column 28 to 52");
                      }();
                      var y = function () {
                         switch (_.ctor)
                         {case "::": return _._0;}
                         _U.badCase($moduleName,
                         "on line 504, column 28 to 52");
                      }();
                      var ys = function () {
                         switch (_.ctor)
                         {case "::": return _._1;}
                         _U.badCase($moduleName,
                         "on line 504, column 28 to 52");
                      }();
                      return A2(cmp,
                      xs$._0,
                      xs$._1._0) ? A2($List._op["::"],
                      A2($List._op["::"],xs$._0,y),
                      ys) : A2($List._op["::"],
                      _L.fromArray([xs$._0]),
                      r);
                   }();
                 case "[]":
                 return _L.fromArray([_L.fromArray([xs$._0])]);}
              break;
            case "[]":
            return _L.fromArray([]);}
         _U.badCase($moduleName,
         "between lines 500 and 507");
      }();
   });
   var stripPrefix = F2(function (prefix,
   xs) {
      return function () {
         var step = F2(function (e,
         m) {
            return function () {
               switch (m.ctor)
               {case "Just": switch (m._0.ctor)
                    {case "::": return _U.eq(e,
                         m._0._0) ? $Maybe.Just(m._0._1) : $Maybe.Nothing;
                       case "[]":
                       return $Maybe.Nothing;}
                    break;
                  case "Nothing":
                  return $Maybe.Nothing;}
               _U.badCase($moduleName,
               "between lines 461 and 467");
            }();
         });
         return A3($List.foldl,
         step,
         $Maybe.Just(xs),
         prefix);
      }();
   });
   var dropWhileEnd = function (p) {
      return A2($List.foldr,
      F2(function (x,xs) {
         return p(x) && $List.isEmpty(xs) ? _L.fromArray([]) : A2($List._op["::"],
         x,
         xs);
      }),
      _L.fromArray([]));
   };
   var takeWhileEnd = function (p) {
      return function () {
         var step = F2(function (x,
         _v37) {
            return function () {
               switch (_v37.ctor)
               {case "_Tuple2":
                  return p(x) && _v37._1 ? {ctor: "_Tuple2"
                                           ,_0: A2($List._op["::"],
                                           x,
                                           _v37._0)
                                           ,_1: true} : {ctor: "_Tuple2"
                                                        ,_0: _v37._0
                                                        ,_1: false};}
               _U.badCase($moduleName,
               "on line 420, column 24 to 73");
            }();
         });
         return function ($) {
            return $Basics.fst(A2($List.foldr,
            step,
            {ctor: "_Tuple2"
            ,_0: _L.fromArray([])
            ,_1: true})($));
         };
      }();
   };
   var splitAt = F2(function (n,
   xs) {
      return {ctor: "_Tuple2"
             ,_0: A2($List.take,n,xs)
             ,_1: A2($List.drop,n,xs)};
   });
   var unfoldr = F2(function (f,
   seed) {
      return function () {
         var _v41 = f(seed);
         switch (_v41.ctor)
         {case "Just":
            switch (_v41._0.ctor)
              {case "_Tuple2":
                 return A2($List._op["::"],
                   _v41._0._0,
                   A2(unfoldr,f,_v41._0._1));}
              break;
            case "Nothing":
            return _L.fromArray([]);}
         _U.badCase($moduleName,
         "between lines 397 and 399");
      }();
   });
   var scanr1 = F2(function (f,
   xs$) {
      return function () {
         switch (xs$.ctor)
         {case "::": switch (xs$._1.ctor)
              {case "[]":
                 return _L.fromArray([xs$._0]);}
              return function () {
                 var _ = A2(scanr1,f,xs$._1);
                 var q = function () {
                    switch (_.ctor)
                    {case "::": return _._0;}
                    _U.badCase($moduleName,
                    "on line 388, column 37 to 48");
                 }();
                 var qs = function () {
                    switch (_.ctor)
                    {case "::": return _;}
                    _U.badCase($moduleName,
                    "on line 388, column 37 to 48");
                 }();
                 return A2($List._op["::"],
                 A2(f,xs$._0,q),
                 qs);
              }();
            case "[]":
            return _L.fromArray([]);}
         _U.badCase($moduleName,
         "between lines 385 and 389");
      }();
   });
   var scanr = F3(function (f,
   acc,
   xs$) {
      return function () {
         switch (xs$.ctor)
         {case "::": return function () {
                 var _ = A3(scanr,
                 f,
                 acc,
                 xs$._1);
                 var q = function () {
                    switch (_.ctor)
                    {case "::": return _._0;}
                    _U.badCase($moduleName,
                    "on line 374, column 37 to 51");
                 }();
                 var qs = function () {
                    switch (_.ctor)
                    {case "::": return _;}
                    _U.badCase($moduleName,
                    "on line 374, column 37 to 51");
                 }();
                 return A2($List._op["::"],
                 A2(f,xs$._0,q),
                 qs);
              }();
            case "[]":
            return _L.fromArray([acc]);}
         _U.badCase($moduleName,
         "between lines 372 and 375");
      }();
   });
   var scanl1 = F2(function (f,
   xs$) {
      return function () {
         switch (xs$.ctor)
         {case "::":
            return A3($List.scanl,
              f,
              xs$._0,
              xs$._1);
            case "[]":
            return _L.fromArray([]);}
         _U.badCase($moduleName,
         "between lines 357 and 359");
      }();
   });
   var foldr1 = F2(function (f,
   xs) {
      return function () {
         var mf = F2(function (x,m) {
            return $Maybe.Just(function () {
               switch (m.ctor)
               {case "Just": return A2(f,
                    x,
                    m._0);
                  case "Nothing": return x;}
               _U.badCase($moduleName,
               "between lines 336 and 338");
            }());
         });
         return A3($List.foldr,
         mf,
         $Maybe.Nothing,
         xs);
      }();
   });
   var foldl1 = F2(function (f,
   xs) {
      return function () {
         var mf = F2(function (x,m) {
            return $Maybe.Just(function () {
               switch (m.ctor)
               {case "Just": return A2(f,
                    m._0,
                    x);
                  case "Nothing": return x;}
               _U.badCase($moduleName,
               "between lines 321 and 323");
            }());
         });
         return A3($List.foldl,
         mf,
         $Maybe.Nothing,
         xs);
      }();
   });
   var permutations = function (xs$) {
      return function () {
         switch (xs$.ctor)
         {case "[]":
            return _L.fromArray([_L.fromArray([])]);}
         return function () {
            var f = function (_v71) {
               return function () {
                  switch (_v71.ctor)
                  {case "_Tuple2":
                     return A2($List.map,
                       F2(function (x,y) {
                          return A2($List._op["::"],
                          x,
                          y);
                       })(_v71._0),
                       permutations(_v71._1));}
                  _U.badCase($moduleName,
                  "on line 309, column 26 to 54");
               }();
            };
            return A2($List.concatMap,
            f,
            select(xs$));
         }();
      }();
   };
   var isPermutationOf = F2(function (permut,
   xs) {
      return A2($List.member,
      permut,
      permutations(xs));
   });
   var subsequencesNonEmpty = function (xs) {
      return function () {
         switch (xs.ctor)
         {case "::": return function () {
                 var f = F2(function (ys,r) {
                    return A2($List._op["::"],
                    ys,
                    A2($List._op["::"],
                    A2($List._op["::"],xs._0,ys),
                    r));
                 });
                 return A2($List._op["::"],
                 _L.fromArray([xs._0]),
                 A3($List.foldr,
                 f,
                 _L.fromArray([]),
                 subsequencesNonEmpty(xs._1)));
              }();
            case "[]":
            return _L.fromArray([]);}
         _U.badCase($moduleName,
         "between lines 295 and 299");
      }();
   };
   var subsequences = function (xs) {
      return A2($List._op["::"],
      _L.fromArray([]),
      subsequencesNonEmpty(xs));
   };
   var isSubsequenceOf = F2(function (subseq,
   xs) {
      return A2($List.member,
      subseq,
      subsequences(xs));
   });
   var transpose = function (ll) {
      return function () {
         switch (ll.ctor)
         {case "::": switch (ll._0.ctor)
              {case "::": return function () {
                      var tails = A2($List.filterMap,
                      $List.tail,
                      ll._1);
                      var heads = A2($List.filterMap,
                      $List.head,
                      ll._1);
                      return A2($List._op["::"],
                      A2($List._op["::"],
                      ll._0._0,
                      heads),
                      transpose(A2($List._op["::"],
                      ll._0._1,
                      tails)));
                   }();
                 case "[]":
                 return transpose(ll._1);}
              break;
            case "[]":
            return _L.fromArray([]);}
         _U.badCase($moduleName,
         "between lines 272 and 280");
      }();
   };
   var intercalate = function (xs) {
      return function ($) {
         return $List.concat($List.intersperse(xs)($));
      };
   };
   var singleton = function (x) {
      return _L.fromArray([x]);
   };
   var replaceIf = F3(function (predicate,
   replacement,
   list) {
      return A2($List.map,
      function (item) {
         return predicate(item) ? replacement : item;
      },
      list);
   });
   var findIndices = function (p) {
      return function ($) {
         return $List.map($Basics.fst)($List.filter(function (_v83) {
            return function () {
               switch (_v83.ctor)
               {case "_Tuple2":
                  return p(_v83._1);}
               _U.badCase($moduleName,
               "on line 240, column 46 to 49");
            }();
         })($List.indexedMap(F2(function (v0,
         v1) {
            return {ctor: "_Tuple2"
                   ,_0: v0
                   ,_1: v1};
         }))($)));
      };
   };
   var findIndex = function (p) {
      return function ($) {
         return $List.head(findIndices(p)($));
      };
   };
   var elemIndices = function (x) {
      return findIndices(F2(function (x,
      y) {
         return _U.eq(x,y);
      })(x));
   };
   var elemIndex = function (x) {
      return findIndex(F2(function (x,
      y) {
         return _U.eq(x,y);
      })(x));
   };
   var find = F2(function (predicate,
   list) {
      return function () {
         switch (list.ctor)
         {case "::":
            return predicate(list._0) ? $Maybe.Just(list._0) : A2(find,
              predicate,
              list._1);
            case "[]":
            return $Maybe.Nothing;}
         _U.badCase($moduleName,
         "between lines 196 and 204");
      }();
   });
   var notMember = function (x) {
      return function ($) {
         return $Basics.not($List.member(x)($));
      };
   };
   var andThen = $Basics.flip($List.concatMap);
   var lift2 = F3(function (f,
   la,
   lb) {
      return A2(andThen,
      la,
      function (a) {
         return A2(andThen,
         lb,
         function (b) {
            return _L.fromArray([A2(f,
            a,
            b)]);
         });
      });
   });
   var lift3 = F4(function (f,
   la,
   lb,
   lc) {
      return A2(andThen,
      la,
      function (a) {
         return A2(andThen,
         lb,
         function (b) {
            return A2(andThen,
            lc,
            function (c) {
               return _L.fromArray([A3(f,
               a,
               b,
               c)]);
            });
         });
      });
   });
   var lift4 = F5(function (f,
   la,
   lb,
   lc,
   ld) {
      return A2(andThen,
      la,
      function (a) {
         return A2(andThen,
         lb,
         function (b) {
            return A2(andThen,
            lc,
            function (c) {
               return A2(andThen,
               ld,
               function (d) {
                  return _L.fromArray([A4(f,
                  a,
                  b,
                  c,
                  d)]);
               });
            });
         });
      });
   });
   var andMap = F2(function (fl,
   l) {
      return A3($List.map2,
      F2(function (x,y) {
         return x(y);
      }),
      fl,
      l);
   });
   var dropDuplicates = function (list) {
      return function () {
         var step = F2(function (next,
         _v90) {
            return function () {
               switch (_v90.ctor)
               {case "_Tuple2":
                  return A2($Set.member,
                    next,
                    _v90._0) ? {ctor: "_Tuple2"
                               ,_0: _v90._0
                               ,_1: _v90._1} : {ctor: "_Tuple2"
                                               ,_0: A2($Set.insert,
                                               next,
                                               _v90._0)
                                               ,_1: A2($List._op["::"],
                                               next,
                                               _v90._1)};}
               _U.badCase($moduleName,
               "between lines 137 and 139");
            }();
         });
         return $List.reverse($Basics.snd(A3($List.foldl,
         step,
         {ctor: "_Tuple2"
         ,_0: $Set.empty
         ,_1: _L.fromArray([])},
         list)));
      }();
   };
   var dropWhile = F2(function (predicate,
   list) {
      return function () {
         switch (list.ctor)
         {case "::":
            return predicate(list._0) ? A2(dropWhile,
              predicate,
              list._1) : list;
            case "[]":
            return _L.fromArray([]);}
         _U.badCase($moduleName,
         "between lines 126 and 129");
      }();
   });
   var takeWhile = F2(function (predicate,
   list) {
      return function () {
         switch (list.ctor)
         {case "::":
            return predicate(list._0) ? A2($List._op["::"],
              list._0,
              A2(takeWhile,
              predicate,
              list._1)) : _L.fromArray([]);
            case "[]":
            return _L.fromArray([]);}
         _U.badCase($moduleName,
         "between lines 117 and 120");
      }();
   });
   var span = F2(function (p,xs) {
      return {ctor: "_Tuple2"
             ,_0: A2(takeWhile,p,xs)
             ,_1: A2(dropWhile,p,xs)};
   });
   var $break = function (p) {
      return span(function ($) {
         return $Basics.not(p($));
      });
   };
   var groupBy = F2(function (eq,
   xs$) {
      return function () {
         switch (xs$.ctor)
         {case "::": return function () {
                 var $ = A2(span,
                 eq(xs$._0),
                 xs$._1),
                 ys = $._0,
                 zs = $._1;
                 return A2($List._op["::"],
                 A2($List._op["::"],xs$._0,ys),
                 A2(groupBy,eq,zs));
              }();
            case "[]":
            return _L.fromArray([]);}
         _U.badCase($moduleName,
         "between lines 489 and 492");
      }();
   });
   var group = groupBy(F2(function (x,
   y) {
      return _U.eq(x,y);
   }));
   var minimumBy = F2(function (f,
   ls) {
      return function () {
         var minBy = F3(function (f,
         x,
         y) {
            return _U.cmp(f(x),
            f(y)) < 0 ? x : y;
         });
         return function () {
            switch (ls.ctor)
            {case "::":
               return $Maybe.Just(A3($List.foldl,
                 minBy(f),
                 ls._0,
                 ls._1));}
            return $Maybe.Nothing;
         }();
      }();
   });
   var maximumBy = F2(function (f,
   ls) {
      return function () {
         var maxBy = F3(function (f,
         x,
         y) {
            return _U.cmp(f(x),
            f(y)) > 0 ? x : y;
         });
         return function () {
            switch (ls.ctor)
            {case "::":
               return $Maybe.Just(A3($List.foldl,
                 maxBy(f),
                 ls._0,
                 ls._1));}
            return $Maybe.Nothing;
         }();
      }();
   });
   var uncons = function (xs) {
      return function () {
         switch (xs.ctor)
         {case "::":
            return $Maybe.Just({ctor: "_Tuple2"
                               ,_0: xs._0
                               ,_1: xs._1});
            case "[]":
            return $Maybe.Nothing;}
         _U.badCase($moduleName,
         "between lines 91 and 93");
      }();
   };
   var init = function () {
      var maybe = F2(function (d,
      f) {
         return function ($) {
            return $Maybe.withDefault(d)($Maybe.map(f)($));
         };
      });
      return A2($List.foldr,
      function ($) {
         return F2(function (x,y) {
            return function ($) {
               return x(y($));
            };
         })($Maybe.Just)(maybe(_L.fromArray([]))(F2(function (x,
         y) {
            return A2($List._op["::"],
            x,
            y);
         })($)));
      },
      $Maybe.Nothing);
   }();
   var last = foldl1($Basics.flip($Basics.always));
   _elm.List.Extra.values = {_op: _op
                            ,last: last
                            ,init: init
                            ,uncons: uncons
                            ,minimumBy: minimumBy
                            ,maximumBy: maximumBy
                            ,andMap: andMap
                            ,andThen: andThen
                            ,takeWhile: takeWhile
                            ,dropWhile: dropWhile
                            ,dropDuplicates: dropDuplicates
                            ,replaceIf: replaceIf
                            ,singleton: singleton
                            ,intercalate: intercalate
                            ,transpose: transpose
                            ,subsequences: subsequences
                            ,permutations: permutations
                            ,foldl1: foldl1
                            ,foldr1: foldr1
                            ,scanl1: scanl1
                            ,scanr: scanr
                            ,scanr1: scanr1
                            ,unfoldr: unfoldr
                            ,splitAt: splitAt
                            ,takeWhileEnd: takeWhileEnd
                            ,dropWhileEnd: dropWhileEnd
                            ,span: span
                            ,$break: $break
                            ,stripPrefix: stripPrefix
                            ,group: group
                            ,groupBy: groupBy
                            ,groupByTransitive: groupByTransitive
                            ,inits: inits
                            ,tails: tails
                            ,select: select
                            ,selectSplit: selectSplit
                            ,isPrefixOf: isPrefixOf
                            ,isSuffixOf: isSuffixOf
                            ,isInfixOf: isInfixOf
                            ,isSubsequenceOf: isSubsequenceOf
                            ,isPermutationOf: isPermutationOf
                            ,notMember: notMember
                            ,find: find
                            ,elemIndex: elemIndex
                            ,elemIndices: elemIndices
                            ,findIndex: findIndex
                            ,findIndices: findIndices
                            ,zip: zip
                            ,zip3: zip3
                            ,zip4: zip4
                            ,zip5: zip5
                            ,lift2: lift2
                            ,lift3: lift3
                            ,lift4: lift4};
   return _elm.List.Extra.values;
};
Elm.Markdown = Elm.Markdown || {};
Elm.Markdown.make = function (_elm) {
   "use strict";
   _elm.Markdown = _elm.Markdown || {};
   if (_elm.Markdown.values)
   return _elm.Markdown.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Markdown",
   $Basics = Elm.Basics.make(_elm),
   $Graphics$Element = Elm.Graphics.Element.make(_elm),
   $Html = Elm.Html.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Markdown = Elm.Native.Markdown.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var toElementWith = $Native$Markdown.toElementWith;
   var toHtmlWith = $Native$Markdown.toHtmlWith;
   var defaultOptions = {_: {}
                        ,githubFlavored: $Maybe.Just({_: {}
                                                     ,breaks: false
                                                     ,tables: false})
                        ,sanitize: false
                        ,smartypants: false};
   var Options = F3(function (a,
   b,
   c) {
      return {_: {}
             ,githubFlavored: a
             ,sanitize: b
             ,smartypants: c};
   });
   var toElement = function (string) {
      return A2($Native$Markdown.toElementWith,
      defaultOptions,
      string);
   };
   var toHtml = function (string) {
      return A2($Native$Markdown.toHtmlWith,
      defaultOptions,
      string);
   };
   _elm.Markdown.values = {_op: _op
                          ,toHtml: toHtml
                          ,toElement: toElement
                          ,Options: Options
                          ,defaultOptions: defaultOptions
                          ,toHtmlWith: toHtmlWith
                          ,toElementWith: toElementWith};
   return _elm.Markdown.values;
};
Elm.Maybe = Elm.Maybe || {};
Elm.Maybe.make = function (_elm) {
   "use strict";
   _elm.Maybe = _elm.Maybe || {};
   if (_elm.Maybe.values)
   return _elm.Maybe.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Maybe";
   var withDefault = F2(function ($default,
   maybe) {
      return function () {
         switch (maybe.ctor)
         {case "Just": return maybe._0;
            case "Nothing":
            return $default;}
         _U.badCase($moduleName,
         "between lines 45 and 47");
      }();
   });
   var Nothing = {ctor: "Nothing"};
   var oneOf = function (maybes) {
      return function () {
         switch (maybes.ctor)
         {case "::": return function () {
                 switch (maybes._0.ctor)
                 {case "Just": return maybes._0;
                    case "Nothing":
                    return oneOf(maybes._1);}
                 _U.badCase($moduleName,
                 "between lines 64 and 66");
              }();
            case "[]": return Nothing;}
         _U.badCase($moduleName,
         "between lines 59 and 66");
      }();
   };
   var andThen = F2(function (maybeValue,
   callback) {
      return function () {
         switch (maybeValue.ctor)
         {case "Just":
            return callback(maybeValue._0);
            case "Nothing": return Nothing;}
         _U.badCase($moduleName,
         "between lines 110 and 112");
      }();
   });
   var Just = function (a) {
      return {ctor: "Just",_0: a};
   };
   var map = F2(function (f,
   maybe) {
      return function () {
         switch (maybe.ctor)
         {case "Just":
            return Just(f(maybe._0));
            case "Nothing": return Nothing;}
         _U.badCase($moduleName,
         "between lines 76 and 78");
      }();
   });
   _elm.Maybe.values = {_op: _op
                       ,andThen: andThen
                       ,map: map
                       ,withDefault: withDefault
                       ,oneOf: oneOf
                       ,Just: Just
                       ,Nothing: Nothing};
   return _elm.Maybe.values;
};
Elm.Mouse = Elm.Mouse || {};
Elm.Mouse.make = function (_elm) {
   "use strict";
   _elm.Mouse = _elm.Mouse || {};
   if (_elm.Mouse.values)
   return _elm.Mouse.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Mouse",
   $Basics = Elm.Basics.make(_elm),
   $Native$Mouse = Elm.Native.Mouse.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var clicks = $Native$Mouse.clicks;
   var isDown = $Native$Mouse.isDown;
   var position = $Native$Mouse.position;
   var x = A2($Signal.map,
   $Basics.fst,
   position);
   var y = A2($Signal.map,
   $Basics.snd,
   position);
   _elm.Mouse.values = {_op: _op
                       ,position: position
                       ,x: x
                       ,y: y
                       ,isDown: isDown
                       ,clicks: clicks};
   return _elm.Mouse.values;
};
Elm.Native.Array = {};
Elm.Native.Array.make = function(localRuntime) {

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Array = localRuntime.Native.Array || {};
	if (localRuntime.Native.Array.values)
	{
		return localRuntime.Native.Array.values;
	}
	if ('values' in Elm.Native.Array)
	{
		return localRuntime.Native.Array.values = Elm.Native.Array.values;
	}

	var List = Elm.Native.List.make(localRuntime);

	// A RRB-Tree has two distinct data types.
	// Leaf -> "height"  is always 0
	//         "table"   is an array of elements
	// Node -> "height"  is always greater than 0
	//         "table"   is an array of child nodes
	//         "lengths" is an array of accumulated lengths of the child nodes

	// M is the maximal table size. 32 seems fast. E is the allowed increase
	// of search steps when concatting to find an index. Lower values will
	// decrease balancing, but will increase search steps.
	var M = 32;
	var E = 2;

	// An empty array.
	var empty = {
		ctor: "_Array",
		height: 0,
		table: new Array()
	};


	function get(i, array)
	{
		if (i < 0 || i >= length(array))
		{
			throw new Error(
				"Index " + i + " is out of range. Check the length of " +
				"your array first or use getMaybe or getWithDefault.");
		}
		return unsafeGet(i, array);
	}


	function unsafeGet(i, array)
	{
		for (var x = array.height; x > 0; x--)
		{
			var slot = i >> (x * 5);
			while (array.lengths[slot] <= i)
			{
				slot++;
			}
			if (slot > 0)
			{
				i -= array.lengths[slot - 1];
			}
			array = array.table[slot];
		}
		return array.table[i];
	}


	// Sets the value at the index i. Only the nodes leading to i will get
	// copied and updated.
	function set(i, item, array)
	{
		if (i < 0 || length(array) <= i)
		{
			return array;
		}
		return unsafeSet(i, item, array);
	}


	function unsafeSet(i, item, array)
	{
		array = nodeCopy(array);

		if (array.height == 0)
		{
			array.table[i] = item;
		}
		else
		{
			var slot = getSlot(i, array);
			if (slot > 0)
			{
				i -= array.lengths[slot - 1];
			}
			array.table[slot] = unsafeSet(i, item, array.table[slot]);
		}
		return array;
	}


	function initialize(len, f)
	{
		if (len == 0)
		{
			return empty;
		}
		var h = Math.floor( Math.log(len) / Math.log(M) );
		return initialize_(f, h, 0, len);
	}

	function initialize_(f, h, from, to)
	{
		if (h == 0)
		{
			var table = new Array((to - from) % (M + 1));
			for (var i = 0; i < table.length; i++)
			{
			  table[i] = f(from + i);
			}
			return {
				ctor: "_Array",
				height: 0,
				table: table
			};
		}

		var step = Math.pow(M, h);
		var table = new Array(Math.ceil((to - from) / step));
		var lengths = new Array(table.length);
		for (var i = 0; i < table.length; i++)
		{
			table[i] = initialize_(f, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
			lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
		}
		return {
			ctor: "_Array",
			height: h,
			table: table,
			lengths: lengths
		};
	}

	function fromList(list)
	{
		if (list == List.Nil)
		{
			return empty;
		}

		// Allocate M sized blocks (table) and write list elements to it.
		var table = new Array(M);
		var nodes = new Array();
		var i = 0;

		while (list.ctor !== '[]')
		{
			table[i] = list._0;
			list = list._1;
			i++;

			// table is full, so we can push a leaf containing it into the
			// next node.
			if (i == M)
			{
				var leaf = {
					ctor: "_Array",
					height: 0,
					table: table
				};
				fromListPush(leaf, nodes);
				table = new Array(M);
				i = 0;
			}
		}

		// Maybe there is something left on the table.
		if (i > 0)
		{
			var leaf = {
				ctor: "_Array",
				height: 0,
				table: table.splice(0,i)
			};
			fromListPush(leaf, nodes);
		}

		// Go through all of the nodes and eventually push them into higher nodes.
		for (var h = 0; h < nodes.length - 1; h++)
		{
			if (nodes[h].table.length > 0)
			{
				fromListPush(nodes[h], nodes);
			}
		}

		var head = nodes[nodes.length - 1];
		if (head.height > 0 && head.table.length == 1)
		{
			return head.table[0];
		}
		else
		{
			return head;
		}
	}

	// Push a node into a higher node as a child.
	function fromListPush(toPush, nodes)
	{
		var h = toPush.height;

		// Maybe the node on this height does not exist.
		if (nodes.length == h)
		{
			var node = {
				ctor: "_Array",
				height: h + 1,
				table: new Array(),
				lengths: new Array()
			};
			nodes.push(node);
		}

		nodes[h].table.push(toPush);
		var len = length(toPush);
		if (nodes[h].lengths.length > 0)
		{
			len += nodes[h].lengths[nodes[h].lengths.length - 1];
		}
		nodes[h].lengths.push(len);

		if (nodes[h].table.length == M)
		{
			fromListPush(nodes[h], nodes);
			nodes[h] = {
				ctor: "_Array",
				height: h + 1,
				table: new Array(),
				lengths: new Array()
			};
		}
	}

	// Pushes an item via push_ to the bottom right of a tree.
	function push(item, a)
	{
		var pushed = push_(item, a);
		if (pushed !== null)
		{
			return pushed;
		}

		var newTree = create(item, a.height);
		return siblise(a, newTree);
	}

	// Recursively tries to push an item to the bottom-right most
	// tree possible. If there is no space left for the item,
	// null will be returned.
	function push_(item, a)
	{
		// Handle resursion stop at leaf level.
		if (a.height == 0)
		{
			if (a.table.length < M)
			{
				var newA = {
					ctor: "_Array",
					height: 0,
					table: a.table.slice()
				};
				newA.table.push(item);
				return newA;
			}
			else
			{
			  return null;
			}
		}

		// Recursively push
		var pushed = push_(item, botRight(a));

		// There was space in the bottom right tree, so the slot will
		// be updated.
		if (pushed != null)
		{
			var newA = nodeCopy(a);
			newA.table[newA.table.length - 1] = pushed;
			newA.lengths[newA.lengths.length - 1]++;
			return newA;
		}

		// When there was no space left, check if there is space left
		// for a new slot with a tree which contains only the item
		// at the bottom.
		if (a.table.length < M)
		{
			var newSlot = create(item, a.height - 1);
			var newA = nodeCopy(a);
			newA.table.push(newSlot);
			newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
			return newA;
		}
		else
		{
			return null;
		}
	}

	// Converts an array into a list of elements.
	function toList(a)
	{
		return toList_(List.Nil, a);
	}

	function toList_(list, a)
	{
		for (var i = a.table.length - 1; i >= 0; i--)
		{
			list =
				a.height == 0
					? List.Cons(a.table[i], list)
					: toList_(list, a.table[i]);
		}
		return list;
	}

	// Maps a function over the elements of an array.
	function map(f, a)
	{
		var newA = {
			ctor: "_Array",
			height: a.height,
			table: new Array(a.table.length)
		};
		if (a.height > 0)
		{
			newA.lengths = a.lengths;
		}
		for (var i = 0; i < a.table.length; i++)
		{
			newA.table[i] =
				a.height == 0
					? f(a.table[i])
					: map(f, a.table[i]);
		}
		return newA;
	}

	// Maps a function over the elements with their index as first argument.
	function indexedMap(f, a)
	{
		return indexedMap_(f, a, 0);
	}

	function indexedMap_(f, a, from)
	{
		var newA = {
			ctor: "_Array",
			height: a.height,
			table: new Array(a.table.length)
		};
		if (a.height > 0)
		{
			newA.lengths = a.lengths;
		}
		for (var i = 0; i < a.table.length; i++)
		{
			newA.table[i] =
				a.height == 0
					? A2(f, from + i, a.table[i])
					: indexedMap_(f, a.table[i], i == 0 ? 0 : a.lengths[i - 1]);
		}
		return newA;
	}

	function foldl(f, b, a)
	{
		if (a.height == 0)
		{
			for (var i = 0; i < a.table.length; i++)
			{
				b = A2(f, a.table[i], b);
			}
		}
		else
		{
			for (var i = 0; i < a.table.length; i++)
			{
				b = foldl(f, b, a.table[i]);
			}
		}
		return b;
	}

	function foldr(f, b, a)
	{
		if (a.height == 0)
		{
			for (var i = a.table.length; i--; )
			{
				b = A2(f, a.table[i], b);
			}
		}
		else
		{
			for (var i = a.table.length; i--; )
			{
				b = foldr(f, b, a.table[i]);
			}
		}
		return b;
	}

	// TODO: currently, it slices the right, then the left. This can be
	// optimized.
	function slice(from, to, a)
	{
		if (from < 0)
		{
			from += length(a);
		}
		if (to < 0)
		{
			to += length(a);
		}
		return sliceLeft(from, sliceRight(to, a));
	}

	function sliceRight(to, a)
	{
		if (to == length(a))
		{
			return a;
		}

		// Handle leaf level.
		if (a.height == 0)
		{
			var newA = { ctor:"_Array", height:0 };
			newA.table = a.table.slice(0, to);
			return newA;
		}

		// Slice the right recursively.
		var right = getSlot(to, a);
		var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

		// Maybe the a node is not even needed, as sliced contains the whole slice.
		if (right == 0)
		{
			return sliced;
		}

		// Create new node.
		var newA = {
			ctor: "_Array",
			height: a.height,
			table: a.table.slice(0, right),
			lengths: a.lengths.slice(0, right)
		};
		if (sliced.table.length > 0)
		{
			newA.table[right] = sliced;
			newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
		}
		return newA;
	}

	function sliceLeft(from, a)
	{
		if (from == 0)
		{
			return a;
		}

		// Handle leaf level.
		if (a.height == 0)
		{
			var newA = { ctor:"_Array", height:0 };
			newA.table = a.table.slice(from, a.table.length + 1);
			return newA;
		}

		// Slice the left recursively.
		var left = getSlot(from, a);
		var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

		// Maybe the a node is not even needed, as sliced contains the whole slice.
		if (left == a.table.length - 1)
		{
			return sliced;
		}

		// Create new node.
		var newA = {
			ctor: "_Array",
			height: a.height,
			table: a.table.slice(left, a.table.length + 1),
			lengths: new Array(a.table.length - left)
		};
		newA.table[0] = sliced;
		var len = 0;
		for (var i = 0; i < newA.table.length; i++)
		{
			len += length(newA.table[i]);
			newA.lengths[i] = len;
		}

		return newA;
	}

	// Appends two trees.
	function append(a,b)
	{
		if (a.table.length === 0)
		{
			return b;
		}
		if (b.table.length === 0)
		{
			return a;
		}

		var c = append_(a, b);

		// Check if both nodes can be crunshed together.
		if (c[0].table.length + c[1].table.length <= M)
		{
			if (c[0].table.length === 0)
			{
				return c[1];
			}
			if (c[1].table.length === 0)
			{
				return c[0];
			}

			// Adjust .table and .lengths
			c[0].table = c[0].table.concat(c[1].table);
			if (c[0].height > 0)
			{
				var len = length(c[0]);
				for (var i = 0; i < c[1].lengths.length; i++)
				{
					c[1].lengths[i] += len;
				}
				c[0].lengths = c[0].lengths.concat(c[1].lengths);
			}

			return c[0];
		}

		if (c[0].height > 0)
		{
			var toRemove = calcToRemove(a, b);
			if (toRemove > E)
			{
				c = shuffle(c[0], c[1], toRemove);
			}
		}

		return siblise(c[0], c[1]);
	}

	// Returns an array of two nodes; right and left. One node _may_ be empty.
	function append_(a, b)
	{
		if (a.height === 0 && b.height === 0)
		{
			return [a, b];
		}

		if (a.height !== 1 || b.height !== 1)
		{
			if (a.height === b.height)
			{
				a = nodeCopy(a);
				b = nodeCopy(b);
				var appended = append_(botRight(a), botLeft(b));

				insertRight(a, appended[1]);
				insertLeft(b, appended[0]);
			}
			else if (a.height > b.height)
			{
				a = nodeCopy(a);
				var appended = append_(botRight(a), b);

				insertRight(a, appended[0]);
				b = parentise(appended[1], appended[1].height + 1);
			}
			else
			{
				b = nodeCopy(b);
				var appended = append_(a, botLeft(b));

				var left = appended[0].table.length === 0 ? 0 : 1;
				var right = left === 0 ? 1 : 0;
				insertLeft(b, appended[left]);
				a = parentise(appended[right], appended[right].height + 1);
			}
		}

		// Check if balancing is needed and return based on that.
		if (a.table.length === 0 || b.table.length === 0)
		{
			return [a,b];
		}

		var toRemove = calcToRemove(a, b);
		if (toRemove <= E)
		{
			return [a,b];
		}
		return shuffle(a, b, toRemove);
	}

	// Helperfunctions for append_. Replaces a child node at the side of the parent.
	function insertRight(parent, node)
	{
		var index = parent.table.length - 1;
		parent.table[index] = node;
		parent.lengths[index] = length(node)
		parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
	}

	function insertLeft(parent, node)
	{
		if (node.table.length > 0)
		{
			parent.table[0] = node;
			parent.lengths[0] = length(node);

			var len = length(parent.table[0]);
			for (var i = 1; i < parent.lengths.length; i++)
			{
				len += length(parent.table[i]);
				parent.lengths[i] = len;
			}
		}
		else
		{
			parent.table.shift();
			for (var i = 1; i < parent.lengths.length; i++)
			{
				parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
			}
			parent.lengths.shift();
		}
	}

	// Returns the extra search steps for E. Refer to the paper.
	function calcToRemove(a, b)
	{
		var subLengths = 0;
		for (var i = 0; i < a.table.length; i++)
		{
			subLengths += a.table[i].table.length;
		}
		for (var i = 0; i < b.table.length; i++)
		{
			subLengths += b.table[i].table.length;
		}

		var toRemove = a.table.length + b.table.length
		return toRemove - (Math.floor((subLengths - 1) / M) + 1);
	}

	// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
	function get2(a, b, index)
	{
		return index < a.length
			? a[index]
			: b[index - a.length];
	}

	function set2(a, b, index, value)
	{
		if (index < a.length)
		{
			a[index] = value;
		}
		else
		{
			b[index - a.length] = value;
		}
	}

	function saveSlot(a, b, index, slot)
	{
		set2(a.table, b.table, index, slot);

		var l = (index == 0 || index == a.lengths.length)
			? 0
			: get2(a.lengths, a.lengths, index - 1);

		set2(a.lengths, b.lengths, index, l + length(slot));
	}

	// Creates a node or leaf with a given length at their arrays for perfomance.
	// Is only used by shuffle.
	function createNode(h, length)
	{
		if (length < 0)
		{
			length = 0;
		}
		var a = {
			ctor: "_Array",
			height: h,
			table: new Array(length)
		};
		if (h > 0)
		{
			a.lengths = new Array(length);
		}
		return a;
	}

	// Returns an array of two balanced nodes.
	function shuffle(a, b, toRemove)
	{
		var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
		var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

		// Skip the slots with size M. More precise: copy the slot references
		// to the new node
		var read = 0;
		while (get2(a.table, b.table, read).table.length % M == 0)
		{
			set2(newA.table, newB.table, read, get2(a.table, b.table, read));
			set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
			read++;
		}

		// Pulling items from left to right, caching in a slot before writing
		// it into the new nodes.
		var write = read;
		var slot = new createNode(a.height - 1, 0);
		var from = 0;

		// If the current slot is still containing data, then there will be at
		// least one more write, so we do not break this loop yet.
		while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove)
		{
			// Find out the max possible items for copying.
			var source = get2(a.table, b.table, read);
			var to = Math.min(M - slot.table.length, source.table.length)

			// Copy and adjust size table.
			slot.table = slot.table.concat(source.table.slice(from, to));
			if (slot.height > 0)
			{
				var len = slot.lengths.length;
				for (var i = len; i < len + to - from; i++)
				{
					slot.lengths[i] = length(slot.table[i]);
					slot.lengths[i] += (i > 0 ? slot.lengths[i - 1] : 0);
				}
			}

			from += to;

			// Only proceed to next slots[i] if the current one was
			// fully copied.
			if (source.table.length <= to)
			{
				read++; from = 0;
			}

			// Only create a new slot if the current one is filled up.
			if (slot.table.length == M)
			{
				saveSlot(newA, newB, write, slot);
				slot = createNode(a.height - 1,0);
				write++;
			}
		}

		// Cleanup after the loop. Copy the last slot into the new nodes.
		if (slot.table.length > 0)
		{
			saveSlot(newA, newB, write, slot);
			write++;
		}

		// Shift the untouched slots to the left
		while (read < a.table.length + b.table.length )
		{
			saveSlot(newA, newB, write, get2(a.table, b.table, read));
			read++;
			write++;
		}

		return [newA, newB];
	}

	// Navigation functions
	function botRight(a)
	{
		return a.table[a.table.length - 1];
	}
	function botLeft(a)
	{
		return a.table[0];
	}

	// Copies a node for updating. Note that you should not use this if
	// only updating only one of "table" or "lengths" for performance reasons.
	function nodeCopy(a)
	{
		var newA = {
			ctor: "_Array",
			height: a.height,
			table: a.table.slice()
		};
		if (a.height > 0)
		{
			newA.lengths = a.lengths.slice();
		}
		return newA;
	}

	// Returns how many items are in the tree.
	function length(array)
	{
		if (array.height == 0)
		{
			return array.table.length;
		}
		else
		{
			return array.lengths[array.lengths.length - 1];
		}
	}

	// Calculates in which slot of "table" the item probably is, then
	// find the exact slot via forward searching in  "lengths". Returns the index.
	function getSlot(i, a)
	{
		var slot = i >> (5 * a.height);
		while (a.lengths[slot] <= i)
		{
			slot++;
		}
		return slot;
	}

	// Recursively creates a tree with a given height containing
	// only the given item.
	function create(item, h)
	{
		if (h == 0)
		{
			return {
				ctor: "_Array",
				height: 0,
				table: [item]
			};
		}
		return {
			ctor: "_Array",
			height: h,
			table: [create(item, h - 1)],
			lengths: [1]
		};
	}

	// Recursively creates a tree that contains the given tree.
	function parentise(tree, h)
	{
		if (h == tree.height)
		{
			return tree;
		}

		return {
			ctor: "_Array",
			height: h,
			table: [parentise(tree, h - 1)],
			lengths: [length(tree)]
		};
	}

	// Emphasizes blood brotherhood beneath two trees.
	function siblise(a, b)
	{
		return {
			ctor: "_Array",
			height: a.height + 1,
			table: [a, b],
			lengths: [length(a), length(a) + length(b)]
		};
	}

	function toJSArray(a)
	{
		var jsArray = new Array(length(a));
		toJSArray_(jsArray, 0, a);
		return jsArray;
	}

	function toJSArray_(jsArray, i, a)
	{
		for (var t = 0; t < a.table.length; t++)
		{
			if (a.height == 0)
			{
				jsArray[i + t] = a.table[t];
			}
			else
			{
				var inc = t == 0 ? 0 : a.lengths[t - 1];
				toJSArray_(jsArray, i + inc, a.table[t]);
			}
		}
	}

	function fromJSArray(jsArray)
	{
		if (jsArray.length == 0)
		{
			return empty;
		}
		var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
		return fromJSArray_(jsArray, h, 0, jsArray.length);
	}

	function fromJSArray_(jsArray, h, from, to)
	{
		if (h == 0)
		{
			return {
				ctor: "_Array",
				height: 0,
				table: jsArray.slice(from, to)
			};
		}

		var step = Math.pow(M, h);
		var table = new Array(Math.ceil((to - from) / step));
		var lengths = new Array(table.length);
		for (var i = 0; i < table.length; i++)
		{
			table[i] = fromJSArray_(jsArray, h - 1, from + (i * step), Math.min(from + ((i + 1) * step), to));
			lengths[i] = length(table[i]) + (i > 0 ? lengths[i-1] : 0);
		}
		return {
			ctor: "_Array",
			height: h,
			table: table,
			lengths: lengths
		};
	}

	Elm.Native.Array.values = {
		empty: empty,
		fromList: fromList,
		toList: toList,
		initialize: F2(initialize),
		append: F2(append),
		push: F2(push),
		slice: F3(slice),
		get: F2(get),
		set: F3(set),
		map: F2(map),
		indexedMap: F2(indexedMap),
		foldl: F3(foldl),
		foldr: F3(foldr),
		length: length,

		toJSArray:toJSArray,
		fromJSArray:fromJSArray
	};

	return localRuntime.Native.Array.values = Elm.Native.Array.values;

}

Elm.Native.Basics = {};
Elm.Native.Basics.make = function(localRuntime) {

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Basics = localRuntime.Native.Basics || {};
	if (localRuntime.Native.Basics.values)
	{
		return localRuntime.Native.Basics.values;
	}

	var Utils = Elm.Native.Utils.make(localRuntime);

	function div(a, b)
	{
		return (a/b)|0;
	}
	function rem(a, b)
	{
		return a % b;
	}
	function mod(a, b)
	{
		if (b === 0)
		{
			throw new Error("Cannot perform mod 0. Division by zero error.");
		}
		var r = a % b;
		var m = a === 0 ? 0 : (b > 0 ? (a >= 0 ? r : r+b) : -mod(-a,-b));

		return m === b ? 0 : m;
	}
	function logBase(base, n)
	{
		return Math.log(n) / Math.log(base);
	}
	function negate(n)
	{
		return -n;
	}
	function abs(n)
	{
		return n < 0 ? -n : n;
	}

	function min(a, b)
	{
		return Utils.cmp(a,b) < 0 ? a : b;
	}
	function max(a, b)
	{
		return Utils.cmp(a,b) > 0 ? a : b;
	}
	function clamp(lo, hi, n)
	{
		return Utils.cmp(n,lo) < 0 ? lo : Utils.cmp(n,hi) > 0 ? hi : n;
	}

	function xor(a, b)
	{
		return a !== b;
	}
	function not(b)
	{
		return !b;
	}
	function isInfinite(n)
	{
		return n === Infinity || n === -Infinity
	}

	function truncate(n)
	{
		return n|0;
	}

	function degrees(d)
	{
		return d * Math.PI / 180;
	}
	function turns(t)
	{
		return 2 * Math.PI * t;
	}
	function fromPolar(point)
	{
		var r = point._0;
		var t = point._1;
		return Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
	}
	function toPolar(point)
	{
		var x = point._0;
		var y = point._1;
		return Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y,x));
	}

	return localRuntime.Native.Basics.values = {
		div: F2(div),
		rem: F2(rem),
		mod: F2(mod),

		pi: Math.PI,
		e: Math.E,
		cos: Math.cos,
		sin: Math.sin,
		tan: Math.tan,
		acos: Math.acos,
		asin: Math.asin,
		atan: Math.atan,
		atan2: F2(Math.atan2),

		degrees:  degrees,
		turns:  turns,
		fromPolar:  fromPolar,
		toPolar:  toPolar,

		sqrt: Math.sqrt,
		logBase: F2(logBase),
		negate: negate,
		abs: abs,
		min: F2(min),
		max: F2(max),
		clamp: F3(clamp),
		compare: Utils.compare,

		xor: F2(xor),
		not: not,

		truncate: truncate,
		ceiling: Math.ceil,
		floor: Math.floor,
		round: Math.round,
		toFloat: function(x) { return x; },
		isNaN: isNaN,
		isInfinite: isInfinite
	};
};

Elm.Native.Char = {};
Elm.Native.Char.make = function(localRuntime) {
	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Char = localRuntime.Native.Char || {};
	if (localRuntime.Native.Char.values)
	{
		return localRuntime.Native.Char.values;
	}

	var Utils = Elm.Native.Utils.make(localRuntime);

	return localRuntime.Native.Char.values = {
		fromCode : function(c) { return Utils.chr(String.fromCharCode(c)); },
		toCode   : function(c) { return c.charCodeAt(0); },
		toUpper  : function(c) { return Utils.chr(c.toUpperCase()); },
		toLower  : function(c) { return Utils.chr(c.toLowerCase()); },
		toLocaleUpper : function(c) { return Utils.chr(c.toLocaleUpperCase()); },
		toLocaleLower : function(c) { return Utils.chr(c.toLocaleLowerCase()); },
	};
};

Elm.Native.Color = {};
Elm.Native.Color.make = function(localRuntime) {
	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Color = localRuntime.Native.Color || {};
	if (localRuntime.Native.Color.values)
	{
		return localRuntime.Native.Color.values;
	}

	function toCss(c)
	{
		var format = '';
		var colors = '';
		if (c.ctor === 'RGBA')
		{
			format = 'rgb';
			colors = c._0 + ', ' + c._1 + ', ' + c._2;
		}
		else
		{
			format = 'hsl';
			colors = (c._0 * 180 / Math.PI) + ', ' +
					 (c._1 * 100) + '%, ' +
					 (c._2 * 100) + '%';
		}
		if (c._3 === 1)
		{
			return format + '(' + colors + ')';
		}
		else
		{
			return format + 'a(' + colors + ', ' + c._3 + ')';
		}
	}

	return localRuntime.Native.Color.values = {
		toCss: toCss
	};

};

Elm.Native.DOMInterface = {};
Elm.Native.DOMInterface.make = function(localRuntime) {

    localRuntime.Native = localRuntime.Native || {};
    localRuntime.Native.DOMInterface = localRuntime.Native.DOMInterface || {};
    if (localRuntime.Native.DOMInterface.values)
    {
        return localRuntime.Native.DOMInterface.values;
    }

    var Task = Elm.Native.Task.make(localRuntime);
    var Maybe = Elm.Maybe.make(localRuntime);
    var Utils = Elm.Native.Utils.make(localRuntime);
    var List = Elm.Native.List.make(localRuntime);

    function getElementPositionInfo(selector) {
        return Task.asyncFunction(function(callback) {
            var elems = document.querySelectorAll(selector);

            if(elems.length === 0) {
                return callback(Task.fail({ctor: 'NodeUndefined'}));
            } else {
                var elemList = [];

                for(var i = 0; i < elems.length; i++) {
                    var elem = elems[i];
                    var elemRect = elem.getBoundingClientRect();
                    var margin = {top: 0, left: 0, bottom: 0, right: 0};
                    if(window.getComputedStyle && typeof window.getComputedStyle === "function") {
                        var computedStyle = window.getComputedStyle(elem); //maybe update for better compatibility
                        margin.top = parseFloat(computedStyle.marginTop);
                        margin.left = parseFloat(computedStyle.marginLeft);
                        margin.bottom = parseFloat(computedStyle.marginBottom);
                        margin.right = parseFloat(computedStyle.marginRight);
                    }
                    elemList.push({
                        top: elemRect.top,
                        left: elemRect.left,
                        width: elemRect.width,
                        height: elemRect.height,
                        offset: {width: elem.offsetWidth, height: elem.offsetHeight},
                        client: {width: elem.clientWidth, height: elem.clientHeight},
                        margin: margin
                    });
                }

                return callback(Task.succeed(List.fromArray(elemList)));
            }
        });
    }

    function scrollElementTo(scrollPosition, selector) {
        return Task.asyncFunction(function(callback) {
            var elems = document.querySelectorAll(selector);

            if(elems.length === 0) {
                return callback(Task.fail({ctor: 'NodeUndefined'}));
            } else {
                elems[0].scrollTop = scrollPosition._1;
                elems[0].scrollLeft = scrollPosition._0;
                return callback(Task.succeed(Utils.Tuple0))
            }
        });
    }

    return localRuntime.Native.DOMInterface.values = {
        getElementPositionInfo: getElementPositionInfo,
        scrollElementTo : F2(scrollElementTo)
    };
};

Elm.Native.Debug = {};
Elm.Native.Debug.make = function(localRuntime) {
	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Debug = localRuntime.Native.Debug || {};
	if (localRuntime.Native.Debug.values)
	{
		return localRuntime.Native.Debug.values;
	}

	var toString = Elm.Native.Show.make(localRuntime).toString;

	function log(tag, value)
	{
		var msg = tag + ': ' + toString(value);
		var process = process || {};
		if (process.stdout)
		{
			process.stdout.write(msg);
		}
		else
		{
			console.log(msg);
		}
		return value;
	}

	function crash(message)
	{
		throw new Error(message);
	}

	function tracePath(tag, form)
	{
		if (localRuntime.debug)
		{
			return localRuntime.debug.trace(tag, form);
		}
		return form;
	}

	function watch(tag, value)
	{
		if (localRuntime.debug)
		{
			localRuntime.debug.watch(tag, value);
		}
		return value;
	}

	function watchSummary(tag, summarize, value)
	{
		if (localRuntime.debug)
		{
			localRuntime.debug.watch(tag, summarize(value));
		}
		return value;
	}

	return localRuntime.Native.Debug.values = {
		crash: crash,
		tracePath: F2(tracePath),
		log: F2(log),
		watch: F2(watch),
		watchSummary:F3(watchSummary),
	};
};

Elm.Native.Effects = {};
Elm.Native.Effects.make = function(localRuntime) {

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Effects = localRuntime.Native.Effects || {};
	if (localRuntime.Native.Effects.values)
	{
		return localRuntime.Native.Effects.values;
	}

	var Task = Elm.Native.Task.make(localRuntime);
	var Utils = Elm.Native.Utils.make(localRuntime);
	var Signal = Elm.Signal.make(localRuntime);
	var List = Elm.Native.List.make(localRuntime);


	// polyfill so things will work even if rAF is not available for some reason
	var _requestAnimationFrame =
		typeof requestAnimationFrame !== 'undefined'
			? requestAnimationFrame
			: function(cb) { setTimeout(cb, 1000 / 60); }
			;


	// batchedSending and sendCallback implement a small state machine in order
	// to schedule only one send(time) call per animation frame.
	//
	// Invariants:
	// 1. In the NO_REQUEST state, there is never a scheduled sendCallback.
	// 2. In the PENDING_REQUEST and EXTRA_REQUEST states, there is always exactly
	//    one scheduled sendCallback.
	var NO_REQUEST = 0;
	var PENDING_REQUEST = 1;
	var EXTRA_REQUEST = 2;
	var state = NO_REQUEST;
	var messageArray = [];


	function batchedSending(address, tickMessages)
	{
		// insert ticks into the messageArray
		var foundAddress = false;

		for (var i = messageArray.length; i--; )
		{
			if (messageArray[i].address === address)
			{
				foundAddress = true;
				messageArray[i].tickMessages = A3(List.foldl, List.cons, messageArray[i].tickMessages, tickMessages);
				break;
			}
		}

		if (!foundAddress)
		{
			messageArray.push({ address: address, tickMessages: tickMessages });
		}

		// do the appropriate state transition
		switch (state)
		{
			case NO_REQUEST:
				_requestAnimationFrame(sendCallback);
				state = PENDING_REQUEST;
				break;
			case PENDING_REQUEST:
				state = PENDING_REQUEST;
				break;
			case EXTRA_REQUEST:
				state = PENDING_REQUEST;
				break;
		}
	}


	function sendCallback(time)
	{
		switch (state)
		{
			case NO_REQUEST:
				// This state should not be possible. How can there be no
				// request, yet somehow we are actively fulfilling a
				// request?
				throw new Error(
					'Unexpected send callback.\n' +
					'Please report this to <https://github.com/evancz/elm-effects/issues>.'
				);

			case PENDING_REQUEST:
				// At this point, we do not *know* that another frame is
				// needed, but we make an extra request to rAF just in
				// case. It's possible to drop a frame if rAF is called
				// too late, so we just do it preemptively.
				_requestAnimationFrame(sendCallback);
				state = EXTRA_REQUEST;

				// There's also stuff we definitely need to send.
				send(time);
				return;

			case EXTRA_REQUEST:
				// Turns out the extra request was not needed, so we will
				// stop calling rAF. No reason to call it all the time if
				// no one needs it.
				state = NO_REQUEST;
				return;
		}
	}


	function send(time)
	{
		for (var i = messageArray.length; i--; )
		{
			var messages = A3(
				List.foldl,
				F2( function(toAction, list) { return List.Cons(toAction(time), list); } ),
				List.Nil,
				messageArray[i].tickMessages
			);
			Task.perform( A2(Signal.send, messageArray[i].address, messages) );
		}
		messageArray = [];
	}


	function requestTickSending(address, tickMessages)
	{
		return Task.asyncFunction(function(callback) {
			batchedSending(address, tickMessages);
			callback(Task.succeed(Utils.Tuple0));
		});
	}


	return localRuntime.Native.Effects.values = {
		requestTickSending: F2(requestTickSending)
	};

};


// setup
Elm.Native = Elm.Native || {};
Elm.Native.Graphics = Elm.Native.Graphics || {};
Elm.Native.Graphics.Collage = Elm.Native.Graphics.Collage || {};

// definition
Elm.Native.Graphics.Collage.make = function(localRuntime) {
	'use strict';

	// attempt to short-circuit
	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Graphics = localRuntime.Native.Graphics || {};
	localRuntime.Native.Graphics.Collage = localRuntime.Native.Graphics.Collage || {};
	if ('values' in localRuntime.Native.Graphics.Collage)
	{
		return localRuntime.Native.Graphics.Collage.values;
	}

	// okay, we cannot short-ciruit, so now we define everything
	var Color = Elm.Native.Color.make(localRuntime);
	var List = Elm.Native.List.make(localRuntime);
	var NativeElement = Elm.Native.Graphics.Element.make(localRuntime);
	var Transform = Elm.Transform2D.make(localRuntime);
	var Utils = Elm.Native.Utils.make(localRuntime);

	function setStrokeStyle(ctx, style)
	{
		ctx.lineWidth = style.width;

		var cap = style.cap.ctor;
		ctx.lineCap = cap === 'Flat'
			? 'butt'
			: cap === 'Round'
				? 'round'
				: 'square';

		var join = style.join.ctor;
		ctx.lineJoin = join === 'Smooth'
			? 'round'
			: join === 'Sharp'
				? 'miter'
				: 'bevel';

		ctx.miterLimit = style.join._0 || 10;
		ctx.strokeStyle = Color.toCss(style.color);
	}

	function setFillStyle(ctx, style)
	{
		var sty = style.ctor;
		ctx.fillStyle = sty === 'Solid'
			? Color.toCss(style._0)
			: sty === 'Texture'
				? texture(redo, ctx, style._0)
				: gradient(ctx, style._0);
	}

	function trace(ctx, path)
	{
		var points = List.toArray(path);
		var i = points.length - 1;
		if (i <= 0)
		{
			return;
		}
		ctx.moveTo(points[i]._0, points[i]._1);
		while (i--)
		{
			ctx.lineTo(points[i]._0, points[i]._1);
		}
		if (path.closed)
		{
			i = points.length - 1;
			ctx.lineTo(points[i]._0, points[i]._1);
		}
	}

	function line(ctx,style,path)
	{
		(style.dashing.ctor === '[]')
			? trace(ctx, path)
			: customLineHelp(ctx, style, path);
		ctx.scale(1,-1);
		ctx.stroke();
	}

	function customLineHelp(ctx, style, path)
	{
		var points = List.toArray(path);
		if (path.closed)
		{
			points.push(points[0]);
		}
		var pattern = List.toArray(style.dashing);
		var i = points.length - 1;
		if (i <= 0)
		{
			return;
		}
		var x0 = points[i]._0, y0 = points[i]._1;
		var x1=0, y1=0, dx=0, dy=0, remaining=0, nx=0, ny=0;
		var pindex = 0, plen = pattern.length;
		var draw = true, segmentLength = pattern[0];
		ctx.moveTo(x0,y0);
		while (i--)
		{
			x1 = points[i]._0;
			y1 = points[i]._1;
			dx = x1 - x0;
			dy = y1 - y0;
			remaining = Math.sqrt(dx * dx + dy * dy);
			while (segmentLength <= remaining)
			{
				x0 += dx * segmentLength / remaining;
				y0 += dy * segmentLength / remaining;
				ctx[draw ? 'lineTo' : 'moveTo'](x0, y0);
				// update starting position
				dx = x1 - x0;
				dy = y1 - y0;
				remaining = Math.sqrt(dx * dx + dy * dy);
				// update pattern
				draw = !draw;
				pindex = (pindex + 1) % plen;
				segmentLength = pattern[pindex];
			}
			if (remaining > 0)
			{
				ctx[draw ? 'lineTo' : 'moveTo'](x1, y1);
				segmentLength -= remaining;
			}
			x0 = x1;
			y0 = y1;
		}
	}

	function drawLine(ctx, style, path)
	{
		setStrokeStyle(ctx, style);
		return line(ctx, style, path);
	}

	function texture(redo, ctx, src)
	{
		var img = new Image();
		img.src = src;
		img.onload = redo;
		return ctx.createPattern(img, 'repeat');
	}

	function gradient(ctx, grad)
	{
		var g;
		var stops = [];
		if (grad.ctor === 'Linear')
		{
			var p0 = grad._0, p1 = grad._1;
			g = ctx.createLinearGradient(p0._0, -p0._1, p1._0, -p1._1);
			stops = List.toArray(grad._2);
		}
		else
		{
			var p0 = grad._0, p2 = grad._2;
			g = ctx.createRadialGradient(p0._0, -p0._1, grad._1, p2._0, -p2._1, grad._3);
			stops = List.toArray(grad._4);
		}
		var len = stops.length;
		for (var i = 0; i < len; ++i)
		{
			var stop = stops[i];
			g.addColorStop(stop._0, Color.toCss(stop._1));
		}
		return g;
	}

	function drawShape(redo, ctx, style, path)
	{
		trace(ctx, path);
		setFillStyle(ctx, style);
		ctx.scale(1,-1);
		ctx.fill();
	}


	// TEXT RENDERING

	function fillText(redo, ctx, text)
	{
		drawText(ctx, text, ctx.fillText);
	}

	function strokeText(redo, ctx, style, text)
	{
		setStrokeStyle(ctx, style);
		// Use native canvas API for dashes only for text for now
		// Degrades to non-dashed on IE 9 + 10
		if (style.dashing.ctor !== '[]' && ctx.setLineDash)
		{
			var pattern = List.toArray(style.dashing);
			ctx.setLineDash(pattern);
		}
		drawText(ctx, text, ctx.strokeText);
	}

	function drawText(ctx, text, canvasDrawFn)
	{
		var textChunks = chunkText(defaultContext, text);

		var totalWidth = 0;
		var maxHeight = 0;
		var numChunks = textChunks.length;

		ctx.scale(1,-1);

		for (var i = numChunks; i--; )
		{
			var chunk = textChunks[i];
			ctx.font = chunk.font;
			var metrics = ctx.measureText(chunk.text);
			chunk.width = metrics.width;
			totalWidth += chunk.width;
			if (chunk.height > maxHeight)
			{
				maxHeight = chunk.height;
			}
		}

		var x = -totalWidth / 2.0;
		for (var i = 0; i < numChunks; ++i)
		{
			var chunk = textChunks[i];
			ctx.font = chunk.font;
			ctx.fillStyle = chunk.color;
			canvasDrawFn.call(ctx, chunk.text, x, maxHeight / 2);
			x += chunk.width;
		}
	}

	function toFont(props)
	{
		return [
			props['font-style'],
			props['font-variant'],
			props['font-weight'],
			props['font-size'],
			props['font-family']
		].join(' ');
	}


	// Convert the object returned by the text module
	// into something we can use for styling canvas text
	function chunkText(context, text)
	{
		var tag = text.ctor;
		if (tag === 'Text:Append')
		{
			var leftChunks = chunkText(context, text._0);
			var rightChunks = chunkText(context, text._1);
			return leftChunks.concat(rightChunks);
		}
		if (tag === 'Text:Text')
		{
			return [{
				text: text._0,
				color: context.color,
				height: context['font-size'].slice(0,-2) | 0,
				font: toFont(context)
			}];
		}
		if (tag === 'Text:Meta')
		{
			var newContext = freshContext(text._0, context);
			return chunkText(newContext, text._1);
		}
	}

	function freshContext(props, ctx)
	{
		return {
			'font-style': props['font-style'] || ctx['font-style'],
			'font-variant': props['font-variant'] || ctx['font-variant'],
			'font-weight': props['font-weight'] || ctx['font-weight'],
			'font-size': props['font-size'] || ctx['font-size'],
			'font-family': props['font-family'] || ctx['font-family'],
			'color': props['color'] || ctx['color']
		};
	}

	var defaultContext = {
		'font-style': 'normal',
		'font-variant': 'normal',
		'font-weight': 'normal',
		'font-size': '12px',
		'font-family': 'sans-serif',
		'color': 'black'
	};


	// IMAGES

	function drawImage(redo, ctx, form)
	{
		var img = new Image();
		img.onload = redo;
		img.src = form._3;
		var w = form._0,
			h = form._1,
			pos = form._2,
			srcX = pos._0,
			srcY = pos._1,
			srcW = w,
			srcH = h,
			destX = -w/2,
			destY = -h/2,
			destW = w,
			destH = h;

		ctx.scale(1,-1);
		ctx.drawImage(img, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
	}

	function renderForm(redo, ctx, form)
	{
		ctx.save();

		var x = form.x,
			y = form.y,
			theta = form.theta,
			scale = form.scale;

		if (x !== 0 || y !== 0)
		{
			ctx.translate(x, y);
		}
		if (theta !== 0)
		{
			ctx.rotate(theta);
		}
		if (scale !== 1)
		{
			ctx.scale(scale,scale);
		}
		if (form.alpha !== 1)
		{
			ctx.globalAlpha = ctx.globalAlpha * form.alpha;
		}

		ctx.beginPath();
		var f = form.form;
		switch (f.ctor)
		{
			case 'FPath':
				drawLine(ctx, f._0, f._1);
				break;

			case 'FImage':
				drawImage(redo, ctx, f);
				break;

			case 'FShape':
				if (f._0.ctor === 'Line')
				{
					f._1.closed = true;
					drawLine(ctx, f._0._0, f._1);
				}
				else
				{
					drawShape(redo, ctx, f._0._0, f._1);
				}
				break;

			case 'FText':
				fillText(redo, ctx, f._0);
				break;

			case 'FOutlinedText':
				strokeText(redo, ctx, f._0, f._1);
				break;
		}
		ctx.restore();
	}

	function formToMatrix(form)
	{
	   var scale = form.scale;
	   var matrix = A6( Transform.matrix, scale, 0, 0, scale, form.x, form.y );

	   var theta = form.theta
	   if (theta !== 0)
	   {
		   matrix = A2( Transform.multiply, matrix, Transform.rotation(theta) );
	   }

	   return matrix;
	}

	function str(n)
	{
		if (n < 0.00001 && n > -0.00001)
		{
			return 0;
		}
		return n;
	}

	function makeTransform(w, h, form, matrices)
	{
		var props = form.form._0.props;
		var m = A6( Transform.matrix, 1, 0, 0, -1,
					(w - props.width ) / 2,
					(h - props.height) / 2 );
		var len = matrices.length;
		for (var i = 0; i < len; ++i)
		{
			m = A2( Transform.multiply, m, matrices[i] );
		}
		m = A2( Transform.multiply, m, formToMatrix(form) );

		return 'matrix(' +
			str( m[0]) + ', ' + str( m[3]) + ', ' +
			str(-m[1]) + ', ' + str(-m[4]) + ', ' +
			str( m[2]) + ', ' + str( m[5]) + ')';
	}

	function stepperHelp(list)
	{
		var arr = List.toArray(list);
		var i = 0;
		function peekNext()
		{
			return i < arr.length ? arr[i].form.ctor : '';
		}
		// assumes that there is a next element
		function next()
		{
			var out = arr[i];
			++i;
			return out;
		}
		return {
			peekNext: peekNext,
			next: next
		};
	}

	function formStepper(forms)
	{
		var ps = [stepperHelp(forms)];
		var matrices = [];
		var alphas = [];
		function peekNext()
		{
			var len = ps.length;
			var formType = '';
			for (var i = 0; i < len; ++i )
			{
				if (formType = ps[i].peekNext()) return formType;
			}
			return '';
		}
		// assumes that there is a next element
		function next(ctx)
		{
			while (!ps[0].peekNext())
			{
				ps.shift();
				matrices.pop();
				alphas.shift();
				if (ctx)
				{
					ctx.restore();
				}
			}
			var out = ps[0].next();
			var f = out.form;
			if (f.ctor === 'FGroup')
			{
				ps.unshift(stepperHelp(f._1));
				var m = A2(Transform.multiply, f._0, formToMatrix(out));
				ctx.save();
				ctx.transform(m[0], m[3], m[1], m[4], m[2], m[5]);
				matrices.push(m);

				var alpha = (alphas[0] || 1) * out.alpha;
				alphas.unshift(alpha);
				ctx.globalAlpha = alpha;
			}
			return out;
		}
		function transforms()
		{
			return matrices;
		}
		function alpha()
		{
			return alphas[0] || 1;
		}
		return {
			peekNext: peekNext,
			next: next,
			transforms: transforms,
			alpha: alpha
		};
	}

	function makeCanvas(w,h)
	{
		var canvas = NativeElement.createNode('canvas');
		canvas.style.width  = w + 'px';
		canvas.style.height = h + 'px';
		canvas.style.display = "block";
		canvas.style.position = "absolute";
		var ratio = window.devicePixelRatio || 1;
		canvas.width  = w * ratio;
		canvas.height = h * ratio;
		return canvas;
	}

	function render(model)
	{
		var div = NativeElement.createNode('div');
		div.style.overflow = 'hidden';
		div.style.position = 'relative';
		update(div, model, model);
		return div;
	}

	function nodeStepper(w,h,div)
	{
		var kids = div.childNodes;
		var i = 0;
		var ratio = window.devicePixelRatio || 1;

		function transform(transforms, ctx)
		{
			ctx.translate( w / 2 * ratio, h / 2 * ratio );
			ctx.scale( ratio, -ratio );
			var len = transforms.length;
			for (var i = 0; i < len; ++i)
			{
				var m = transforms[i];
				ctx.save();
				ctx.transform(m[0], m[3], m[1], m[4], m[2], m[5]);
			}
			return ctx;
		}
		function nextContext(transforms)
		{
			while (i < kids.length)
			{
				var node = kids[i];
				if (node.getContext)
				{
					node.width = w * ratio;
					node.height = h * ratio;
					node.style.width = w + 'px';
					node.style.height = h + 'px';
					++i;
					return transform(transforms, node.getContext('2d'));
				}
				div.removeChild(node);
			}
			var canvas = makeCanvas(w,h);
			div.appendChild(canvas);
			// we have added a new node, so we must step our position
			++i;
			return transform(transforms, canvas.getContext('2d'));
		}
		function addElement(matrices, alpha, form)
		{
			var kid = kids[i];
			var elem = form.form._0;

			var node = (!kid || kid.getContext)
				? NativeElement.render(elem)
				: NativeElement.update(kid, kid.oldElement, elem);

			node.style.position = 'absolute';
			node.style.opacity = alpha * form.alpha * elem.props.opacity;
			NativeElement.addTransform(node.style, makeTransform(w, h, form, matrices));
			node.oldElement = elem;
			++i;
			if (!kid)
			{
				div.appendChild(node);
			}
			else
			{
				div.insertBefore(node, kid);
			}
		}
		function clearRest()
		{
			while (i < kids.length)
			{
				div.removeChild(kids[i]);
			}
		}
		return {
			nextContext: nextContext,
			addElement: addElement,
			clearRest: clearRest
		};
	}


	function update(div, _, model)
	{
		var w = model.w;
		var h = model.h;

		var forms = formStepper(model.forms);
		var nodes = nodeStepper(w,h,div);
		var ctx = null;
		var formType = '';

		while (formType = forms.peekNext())
		{
			// make sure we have context if we need it
			if (ctx === null && formType !== 'FElement')
			{
				ctx = nodes.nextContext(forms.transforms());
				ctx.globalAlpha = forms.alpha();
			}

			var form = forms.next(ctx);
			// if it is FGroup, all updates are made within formStepper when next is called.
			if (formType === 'FElement')
			{
				// update or insert an element, get a new context
				nodes.addElement(forms.transforms(), forms.alpha(), form);
				ctx = null;
			}
			else if (formType !== 'FGroup')
			{
				renderForm(function() { update(div, model, model); }, ctx, form);
			}
		}
		nodes.clearRest();
		return div;
	}


	function collage(w,h,forms)
	{
		return A3(NativeElement.newElement, w, h, {
			ctor: 'Custom',
			type: 'Collage',
			render: render,
			update: update,
			model: {w:w, h:h, forms:forms}
		});
	}

	return localRuntime.Native.Graphics.Collage.values = {
		collage: F3(collage)
	};

};


// setup
Elm.Native = Elm.Native || {};
Elm.Native.Graphics = Elm.Native.Graphics || {};
Elm.Native.Graphics.Element = Elm.Native.Graphics.Element || {};

// definition
Elm.Native.Graphics.Element.make = function(localRuntime) {
	'use strict';

	// attempt to short-circuit
	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Graphics = localRuntime.Native.Graphics || {};
	localRuntime.Native.Graphics.Element = localRuntime.Native.Graphics.Element || {};
	if ('values' in localRuntime.Native.Graphics.Element)
	{
		return localRuntime.Native.Graphics.Element.values;
	}

	var Color = Elm.Native.Color.make(localRuntime);
	var List = Elm.Native.List.make(localRuntime);
	var Maybe = Elm.Maybe.make(localRuntime);
	var Text = Elm.Native.Text.make(localRuntime);
	var Utils = Elm.Native.Utils.make(localRuntime);


	// CREATION

	function createNode(elementType)
	{
		var node = document.createElement(elementType);
		node.style.padding = "0";
		node.style.margin = "0";
		return node;
	}


	function newElement(width, height, elementPrim)
	{
		return {
			_: {},
			element: elementPrim,
			props: {
				_: {},
				id: Utils.guid(),
				width: width,
				height: height,
				opacity: 1,
				color: Maybe.Nothing,
				href: "",
				tag: "",
				hover: Utils.Tuple0,
				click: Utils.Tuple0
			}
		};
	}


	// PROPERTIES

	function setProps(elem, node)
	{
		var props = elem.props;

		var element = elem.element;
		var width = props.width - (element.adjustWidth || 0);
		var height = props.height - (element.adjustHeight || 0);
		node.style.width  = (width |0) + 'px';
		node.style.height = (height|0) + 'px';

		if (props.opacity !== 1)
		{
			node.style.opacity = props.opacity;
		}

		if (props.color.ctor === 'Just')
		{
			node.style.backgroundColor = Color.toCss(props.color._0);
		}

		if (props.tag !== '')
		{
			node.id = props.tag;
		}

		if (props.hover.ctor !== '_Tuple0')
		{
			addHover(node, props.hover);
		}

		if (props.click.ctor !== '_Tuple0')
		{
			addClick(node, props.click);
		}

		if (props.href !== '')
		{
			var anchor = createNode('a');
			anchor.href = props.href;
			anchor.style.display = 'block';
			anchor.style.pointerEvents = 'auto';
			anchor.appendChild(node);
			node = anchor;
		}

		return node;
	}

	function addClick(e, handler)
	{
		e.style.pointerEvents = 'auto';
		e.elm_click_handler = handler;
		function trigger(ev)
		{
			e.elm_click_handler(Utils.Tuple0);
			ev.stopPropagation();
		}
		e.elm_click_trigger = trigger;
		e.addEventListener('click', trigger);
	}

	function removeClick(e, handler)
	{
		if (e.elm_click_trigger)
		{
			e.removeEventListener('click', e.elm_click_trigger);
			e.elm_click_trigger = null;
			e.elm_click_handler = null;
		}
	}

	function addHover(e, handler)
	{
		e.style.pointerEvents = 'auto';
		e.elm_hover_handler = handler;
		e.elm_hover_count = 0;

		function over(evt)
		{
			if (e.elm_hover_count++ > 0) return;
			e.elm_hover_handler(true);
			evt.stopPropagation();
		}
		function out(evt)
		{
			if (e.contains(evt.toElement || evt.relatedTarget)) return;
			e.elm_hover_count = 0;
			e.elm_hover_handler(false);
			evt.stopPropagation();
		}
		e.elm_hover_over = over;
		e.elm_hover_out = out;
		e.addEventListener('mouseover', over);
		e.addEventListener('mouseout', out);
	}

	function removeHover(e)
	{
		e.elm_hover_handler = null;
		if (e.elm_hover_over)
		{
			e.removeEventListener('mouseover', e.elm_hover_over);
			e.elm_hover_over = null;
		}
		if (e.elm_hover_out)
		{
			e.removeEventListener('mouseout', e.elm_hover_out);
			e.elm_hover_out = null;
		}
	}


	// IMAGES

	function image(props, img)
	{
		switch (img._0.ctor)
		{
			case 'Plain':
				return plainImage(img._3);

			case 'Fitted':
				return fittedImage(props.width, props.height, img._3);

			case 'Cropped':
				return croppedImage(img,props.width,props.height,img._3);

			case 'Tiled':
				return tiledImage(img._3);
		}
	}

	function plainImage(src)
	{
		var img = createNode('img');
		img.src = src;
		img.name = src;
		img.style.display = "block";
		return img;
	}

	function tiledImage(src)
	{
		var div = createNode('div');
		div.style.backgroundImage = 'url(' + src + ')';
		return div;
	}

	function fittedImage(w, h, src)
	{
		var div = createNode('div');
		div.style.background = 'url(' + src + ') no-repeat center';
		div.style.webkitBackgroundSize = 'cover';
		div.style.MozBackgroundSize = 'cover';
		div.style.OBackgroundSize = 'cover';
		div.style.backgroundSize = 'cover';
		return div;
	}

	function croppedImage(elem, w, h, src)
	{
		var pos = elem._0._0;
		var e = createNode('div');
		e.style.overflow = "hidden";

		var img = createNode('img');
		img.onload = function() {
			var sw = w / elem._1, sh = h / elem._2;
			img.style.width = ((this.width * sw)|0) + 'px';
			img.style.height = ((this.height * sh)|0) + 'px';
			img.style.marginLeft = ((- pos._0 * sw)|0) + 'px';
			img.style.marginTop = ((- pos._1 * sh)|0) + 'px';
		};
		img.src = src;
		img.name = src;
		e.appendChild(img);
		return e;
	}


	// FLOW

	function goOut(node)
	{
		node.style.position = 'absolute';
		return node;
	}
	function goDown(node)
	{
		return node;
	}
	function goRight(node)
	{
		node.style.styleFloat = 'left';
		node.style.cssFloat = 'left';
		return node;
	}

	var directionTable = {
		DUp    : goDown,
		DDown  : goDown,
		DLeft  : goRight,
		DRight : goRight,
		DIn    : goOut,
		DOut   : goOut
	};
	function needsReversal(dir)
	{
		return dir == 'DUp' || dir == 'DLeft' || dir == 'DIn';
	}

	function flow(dir,elist)
	{
		var array = List.toArray(elist);
		var container = createNode('div');
		var goDir = directionTable[dir];
		if (goDir == goOut)
		{
			container.style.pointerEvents = 'none';
		}
		if (needsReversal(dir))
		{
			array.reverse();
		}
		var len = array.length;
		for (var i = 0; i < len; ++i)
		{
			container.appendChild(goDir(render(array[i])));
		}
		return container;
	}


	// CONTAINER

	function toPos(pos)
	{
		return pos.ctor === "Absolute"
			? pos._0 + "px"
			: (pos._0 * 100) + "%";
	}

	// must clear right, left, top, bottom, and transform
	// before calling this function
	function setPos(pos,elem,e)
	{
		var element = elem.element;
		var props = elem.props;
		var w = props.width + (element.adjustWidth ? element.adjustWidth : 0);
		var h = props.height + (element.adjustHeight ? element.adjustHeight : 0);

		e.style.position = 'absolute';
		e.style.margin = 'auto';
		var transform = '';

		switch (pos.horizontal.ctor)
		{
			case 'P':
				e.style.right = toPos(pos.x);
				e.style.removeProperty('left');
				break;

			case 'Z':
				transform = 'translateX(' + ((-w/2)|0) + 'px) ';

			case 'N':
				e.style.left = toPos(pos.x);
				e.style.removeProperty('right');
				break;
		}
		switch (pos.vertical.ctor)
		{
			case 'N':
				e.style.bottom = toPos(pos.y);
				e.style.removeProperty('top');
				break;

			case 'Z':
				transform += 'translateY(' + ((-h/2)|0) + 'px)';

			case 'P':
				e.style.top = toPos(pos.y);
				e.style.removeProperty('bottom');
				break;
		}
		if (transform !== '')
		{
			addTransform(e.style, transform);
		}
		return e;
	}

	function addTransform(style, transform)
	{
		style.transform       = transform;
		style.msTransform     = transform;
		style.MozTransform    = transform;
		style.webkitTransform = transform;
		style.OTransform      = transform;
	}

	function container(pos,elem)
	{
		var e = render(elem);
		setPos(pos, elem, e);
		var div = createNode('div');
		div.style.position = 'relative';
		div.style.overflow = 'hidden';
		div.appendChild(e);
		return div;
	}


	function rawHtml(elem)
	{
		var html = elem.html;
		var guid = elem.guid;
		var align = elem.align;

		var div = createNode('div');
		div.innerHTML = html;
		div.style.visibility = "hidden";
		if (align)
		{
			div.style.textAlign = align;
		}
		div.style.visibility = 'visible';
		div.style.pointerEvents = 'auto';
		return div;
	}


	// RENDER

	function render(elem)
	{
		return setProps(elem, makeElement(elem));
	}
	function makeElement(e)
	{
		var elem = e.element;
		switch(elem.ctor)
		{
			case 'Image':
				return image(e.props, elem);

			case 'Flow':
				return flow(elem._0.ctor, elem._1);

			case 'Container':
				return container(elem._0, elem._1);

			case 'Spacer':
				return createNode('div');

			case 'RawHtml':
				return rawHtml(elem);

			case 'Custom':
				return elem.render(elem.model);
		}
	}

	function updateAndReplace(node, curr, next)
	{
		var newNode = update(node, curr, next);
		if (newNode !== node)
		{
			node.parentNode.replaceChild(newNode, node);
		}
		return newNode;
	}


	// UPDATE

	function update(node, curr, next)
	{
		var rootNode = node;
		if (node.tagName === 'A')
		{
			node = node.firstChild;
		}
		if (curr.props.id === next.props.id)
		{
			updateProps(node, curr, next);
			return rootNode;
		}
		if (curr.element.ctor !== next.element.ctor)
		{
			return render(next);
		}
		var nextE = next.element;
		var currE = curr.element;
		switch(nextE.ctor)
		{
			case "Spacer":
				updateProps(node, curr, next);
				return rootNode;

			case "RawHtml":
				if(currE.html.valueOf() !== nextE.html.valueOf())
				{
					node.innerHTML = nextE.html;
				}
				updateProps(node, curr, next);
				return rootNode;

			case "Image":
				if (nextE._0.ctor === 'Plain')
				{
					if (nextE._3 !== currE._3)
					{
						node.src = nextE._3;
					}
				}
				else if (!Utils.eq(nextE,currE)
					|| next.props.width !== curr.props.width
					|| next.props.height !== curr.props.height)
				{
					return render(next);
				}
				updateProps(node, curr, next);
				return rootNode;

			case "Flow":
				var arr = List.toArray(nextE._1);
				for (var i = arr.length; i--; )
				{
					arr[i] = arr[i].element.ctor;
				}
				if (nextE._0.ctor !== currE._0.ctor)
				{
					return render(next);
				}
				var nexts = List.toArray(nextE._1);
				var kids = node.childNodes;
				if (nexts.length !== kids.length)
				{
					return render(next);
				}
				var currs = List.toArray(currE._1);
				var dir = nextE._0.ctor;
				var goDir = directionTable[dir];
				var toReverse = needsReversal(dir);
				var len = kids.length;
				for (var i = len; i-- ;)
				{
					var subNode = kids[toReverse ? len - i - 1 : i];
					goDir(updateAndReplace(subNode, currs[i], nexts[i]));
				}
				updateProps(node, curr, next);
				return rootNode;

			case "Container":
				var subNode = node.firstChild;
				var newSubNode = updateAndReplace(subNode, currE._1, nextE._1);
				setPos(nextE._0, nextE._1, newSubNode);
				updateProps(node, curr, next);
				return rootNode;

			case "Custom":
				if (currE.type === nextE.type)
				{
					var updatedNode = nextE.update(node, currE.model, nextE.model);
					updateProps(updatedNode, curr, next);
					return updatedNode;
				}
				return render(next);
		}
	}

	function updateProps(node, curr, next)
	{
		var nextProps = next.props;
		var currProps = curr.props;

		var element = next.element;
		var width = nextProps.width - (element.adjustWidth || 0);
		var height = nextProps.height - (element.adjustHeight || 0);
		if (width !== currProps.width)
		{
			node.style.width = (width|0) + 'px';
		}
		if (height !== currProps.height)
		{
			node.style.height = (height|0) + 'px';
		}

		if (nextProps.opacity !== currProps.opacity)
		{
			node.style.opacity = nextProps.opacity;
		}

		var nextColor = nextProps.color.ctor === 'Just'
			? Color.toCss(nextProps.color._0)
			: '';
		if (node.style.backgroundColor !== nextColor)
		{
			node.style.backgroundColor = nextColor;
		}

		if (nextProps.tag !== currProps.tag)
		{
			node.id = nextProps.tag;
		}

		if (nextProps.href !== currProps.href)
		{
			if (currProps.href === '')
			{
				// add a surrounding href
				var anchor = createNode('a');
				anchor.href = nextProps.href;
				anchor.style.display = 'block';
				anchor.style.pointerEvents = 'auto';

				node.parentNode.replaceChild(anchor, node);
				anchor.appendChild(node);
			}
			else if (nextProps.href === '')
			{
				// remove the surrounding href
				var anchor = node.parentNode;
				anchor.parentNode.replaceChild(node, anchor);
			}
			else
			{
				// just update the link
				node.parentNode.href = nextProps.href;
			}
		}

		// update click and hover handlers
		var removed = false;

		// update hover handlers
		if (currProps.hover.ctor === '_Tuple0')
		{
			if (nextProps.hover.ctor !== '_Tuple0')
			{
				addHover(node, nextProps.hover);
			}
		}
		else
		{
			if (nextProps.hover.ctor === '_Tuple0')
			{
				removed = true;
				removeHover(node);
			}
			else
			{
				node.elm_hover_handler = nextProps.hover;
			}
		}

		// update click handlers
		if (currProps.click.ctor === '_Tuple0')
		{
			if (nextProps.click.ctor !== '_Tuple0')
			{
				addClick(node, nextProps.click);
			}
		}
		else
		{
			if (nextProps.click.ctor === '_Tuple0')
			{
				removed = true;
				removeClick(node);
			}
			else
			{
				node.elm_click_handler = nextProps.click;
			}
		}

		// stop capturing clicks if
		if (removed
			&& nextProps.hover.ctor === '_Tuple0'
			&& nextProps.click.ctor === '_Tuple0')
		{
			node.style.pointerEvents = 'none';
		}
	}


	// TEXT

	function block(align)
	{
		return function(text)
		{
			var raw = {
				ctor :'RawHtml',
				html : Text.renderHtml(text),
				align: align
			};
			var pos = htmlHeight(0, raw);
			return newElement(pos._0, pos._1, raw);
		}
	}

	function markdown(text)
	{
		var raw = {
			ctor:'RawHtml',
			html: text,
			align: null
		};
		var pos = htmlHeight(0, raw);
		return newElement(pos._0, pos._1, raw);
	}

	function htmlHeight(width, rawHtml)
	{
		// create dummy node
		var temp = document.createElement('div');
		temp.innerHTML = rawHtml.html;
		if (width > 0)
		{
			temp.style.width = width + "px";
		}
		temp.style.visibility = "hidden";
		temp.style.styleFloat = "left";
		temp.style.cssFloat   = "left";

		document.body.appendChild(temp);

		// get dimensions
		var style = window.getComputedStyle(temp, null);
		var w = Math.ceil(style.getPropertyValue("width").slice(0,-2) - 0);
		var h = Math.ceil(style.getPropertyValue("height").slice(0,-2) - 0);
		document.body.removeChild(temp);
		return Utils.Tuple2(w,h);
	}


	return localRuntime.Native.Graphics.Element.values = {
		render: render,
		update: update,
		updateAndReplace: updateAndReplace,

		createNode: createNode,
		newElement: F3(newElement),
		addTransform: addTransform,
		htmlHeight: F2(htmlHeight),
		guid: Utils.guid,

		block: block,
		markdown: markdown
	};

};

Elm.Native.Howler = {};
Elm.Native.Howler.make = function(localRuntime) {

    localRuntime.Native = localRuntime.Native || {};
    localRuntime.Native.Howler = localRuntime.Native.Howler || {};
    if (localRuntime.Native.Howler.values)
    {
        return localRuntime.Native.Howler.values;
    }

    /*! howler.js v2.0.0-beta | (c) 2013-2015, James Simpson of GoldFire Studios | MIT License | howlerjs.com */
    !function(){"use strict";function e(){try{"undefined"!=typeof AudioContext?n=new AudioContext:"undefined"!=typeof webkitAudioContext?n=new webkitAudioContext:o=!1}catch(e){o=!1}if(!o)if("undefined"!=typeof Audio)try{new Audio}catch(e){t=!0}else t=!0}var n=null,o=!0,t=!1;if(e(),o){var r="undefined"==typeof n.createGain?n.createGainNode():n.createGain();r.gain.value=1,r.connect(n.destination)}var d=function(){this.init()};d.prototype={init:function(){var e=this||u;return e._codecs={},e._howls=[],e._muted=!1,e._volume=1,e.iOSAutoEnable=!0,e.noAudio=t,e.usingWebAudio=o,e.ctx=n,t||e._setupCodecs(),e},volume:function(e){var n=this||u;if(e=parseFloat(e),"undefined"!=typeof e&&e>=0&&1>=e){n._volume=e,o&&(r.gain.value=e);for(var t=0;t<n._howls.length;t++)if(!n._howls[t]._webAudio)for(var d=n._howls[t]._getSoundIds(),a=0;a<d.length;a++){var i=n._howls[t]._soundById(d[a]);i&&i._node&&(i._node.volume=i._volume*e)}return n}return n._volume},mute:function(e){var n=this||u;n._muted=e,o&&(r.gain.value=e?0:n._volume);for(var t=0;t<n._howls.length;t++)if(!n._howls[t]._webAudio)for(var d=n._howls[t]._getSoundIds(),a=0;a<d.length;a++){var i=n._howls[t]._soundById(d[a]);i&&i._node&&(i._node.muted=e?!0:i._muted)}return n},codecs:function(e){return(this||u)._codecs[e]},_setupCodecs:function(){var e=this||u,n=new Audio,o=n.canPlayType("audio/mpeg;").replace(/^no$/,"");return e._codecs={mp3:!(!o&&!n.canPlayType("audio/mp3;").replace(/^no$/,"")),mpeg:!!o,opus:!!n.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!n.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!n.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),aac:!!n.canPlayType("audio/aac;").replace(/^no$/,""),m4a:!!(n.canPlayType("audio/x-m4a;")||n.canPlayType("audio/m4a;")||n.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(n.canPlayType("audio/x-mp4;")||n.canPlayType("audio/mp4;")||n.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!n.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),webm:!!n.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")},e},_enableiOSAudio:function(){var e=this||u;if(!n||!e._iOSEnabled&&/iPhone|iPad|iPod/i.test(navigator.userAgent)){e._iOSEnabled=!1;var o=function(){var t=n.createBuffer(1,1,22050),r=n.createBufferSource();r.buffer=t,r.connect(n.destination),"undefined"==typeof r.start?r.noteOn(0):r.start(0),setTimeout(function(){(r.playbackState===r.PLAYING_STATE||r.playbackState===r.FINISHED_STATE)&&(e._iOSEnabled=!0,e.iOSAutoEnable=!1,document.removeEventListener("touchstart",o,!1))},0)};return document.addEventListener("touchstart",o,!1),e}}};var u=new d,a=function(e){var n=this;return e.src&&0!==e.src.length?void n.init(e):void console.error("An array of source files must be passed with any new Howl.")};a.prototype={init:function(e){var t=this;return t._autoplay=e.autoplay||!1,t._ext=e.ext||null,t._html5=e.html5||!1,t._muted=e.mute||!1,t._loop=e.loop||!1,t._pool=e.pool||5,t._preload="boolean"==typeof e.preload?e.preload:!0,t._rate=e.rate||1,t._sprite=e.sprite||{},t._src="string"!=typeof e.src?e.src:[e.src],t._volume=void 0!==e.volume?e.volume:1,t._duration=0,t._loaded=!1,t._sounds=[],t._endTimers={},t._onend=e.onend?[{fn:e.onend}]:[],t._onfaded=e.onfaded?[{fn:e.onfaded}]:[],t._onload=e.onload?[{fn:e.onload}]:[],t._onloaderror=e.onloaderror?[{fn:e.onloaderror}]:[],t._onpause=e.onpause?[{fn:e.onpause}]:[],t._onplay=e.onplay?[{fn:e.onplay}]:[],t._webAudio=o&&!t._html5,"undefined"!=typeof n&&n&&u.iOSAutoEnable&&u._enableiOSAudio(),u._howls.push(t),t._preload&&t.load(),t},load:function(){var e=this,n=null;if(t)return void e._emit("loaderror");"string"==typeof e._src&&(e._src=[e._src]);for(var o=0;o<e._src.length;o++){var r,d;if(e._ext&&e._ext[o]?r=e._ext[o]:(d=e._src[o],r=/^data:audio\/([^;,]+);/i.exec(d),r||(r=/\.([^.]+)$/.exec(d.split("?",1)[0])),r&&(r=r[1].toLowerCase())),u.codecs(r)){n=e._src[o];break}}return n?(e._src=n,new i(e),e._webAudio&&s(e),e):void e._emit("loaderror")},play:function(e){var o=this,t=arguments,r=null;if("number"==typeof e)r=e,e=null;else if("undefined"==typeof e){e="__default";for(var d=0,a=0;a<o._sounds.length;a++)o._sounds[a]._paused&&!o._sounds[a]._ended&&(d++,r=o._sounds[a]._id);1===d?e=null:r=null}var i=r?o._soundById(r):o._inactiveSound();if(!i)return null;if(r&&!e&&(e=i._sprite||"__default"),!o._loaded&&!o._sprite[e])return o.once("load",function(){o.play(o._soundById(i._id)?i._id:void 0)}),i._id;if(r&&!i._paused)return i._id;var _=i._seek>0?i._seek:o._sprite[e][0]/1e3,s=(o._sprite[e][0]+o._sprite[e][1])/1e3-_,l=function(){var t=!(!i._loop&&!o._sprite[e][2]);o._emit("end",i._id),!o._webAudio&&t&&o.stop(i._id).play(i._id),o._webAudio&&t&&(o._emit("play",i._id),i._seek=i._start||0,i._playStart=n.currentTime,o._endTimers[i._id]=setTimeout(l,1e3*(i._stop-i._start)/Math.abs(o._rate))),o._webAudio&&!t&&(i._paused=!0,i._ended=!0,i._seek=i._start||0,o._clearTimer(i._id),i._node.bufferSource=null),o._webAudio||t||o.stop(i._id)};o._endTimers[i._id]=setTimeout(l,1e3*s/Math.abs(o._rate)),i._paused=!1,i._ended=!1,i._sprite=e,i._seek=_,i._start=o._sprite[e][0]/1e3,i._stop=(o._sprite[e][0]+o._sprite[e][1])/1e3,i._loop=!(!i._loop&&!o._sprite[e][2]);var f=i._node;if(o._webAudio){var c=function(){o._refreshBuffer(i);var e=i._muted||o._muted?0:i._volume*u.volume();f.gain.setValueAtTime(e,n.currentTime),i._playStart=n.currentTime,"undefined"==typeof f.bufferSource.start?i._loop?f.bufferSource.noteGrainOn(0,_,86400):f.bufferSource.noteGrainOn(0,_,s):i._loop?f.bufferSource.start(0,_,86400):f.bufferSource.start(0,_,s),o._endTimers[i._id]||(o._endTimers[i._id]=setTimeout(l,1e3*s/Math.abs(o._rate))),t[1]||setTimeout(function(){o._emit("play",i._id)},0)};o._loaded?c():(o.once("load",c),o._clearTimer(i._id))}else{var p=function(){f.currentTime=_,f.muted=i._muted||o._muted||u._muted||f.muted,f.volume=i._volume*u.volume(),f.playbackRate=o._rate,setTimeout(function(){f.play(),t[1]||o._emit("play",i._id)},0)};if(4===f.readyState||!f.readyState&&navigator.isCocoonJS)p();else{var m=function(){o._endTimers[i._id]=setTimeout(l,1e3*s/Math.abs(o._rate)),p(),f.removeEventListener("canplaythrough",m,!1)};f.addEventListener("canplaythrough",m,!1),o._clearTimer(i._id)}}return i._id},pause:function(e){var n=this;if(!n._loaded)return n.once("play",function(){n.pause(e)}),n;for(var o=n._getSoundIds(e),t=0;t<o.length;t++){n._clearTimer(o[t]);var r=n._soundById(o[t]);if(r&&!r._paused){if(r._seek=n.seek(o[t]),r._paused=!0,n._webAudio){if(!r._node.bufferSource)return n;"undefined"==typeof r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),r._node.bufferSource=null}else isNaN(r._node.duration)||r._node.pause();arguments[1]||n._emit("pause",r._id)}}return n},stop:function(e){var n=this;if(!n._loaded)return"undefined"!=typeof n._sounds[0]._sprite&&n.once("play",function(){n.stop(e)}),n;for(var o=n._getSoundIds(e),t=0;t<o.length;t++){n._clearTimer(o[t]);var r=n._soundById(o[t]);if(r&&!r._paused)if(r._seek=r._start||0,r._paused=!0,r._ended=!0,n._webAudio&&r._node){if(!r._node.bufferSource)return n;"undefined"==typeof r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),r._node.bufferSource=null}else r._node&&!isNaN(r._node.duration)&&(r._node.pause(),r._node.currentTime=r._start||0)}return n},mute:function(e,o){var t=this;if(!t._loaded)return t.once("play",function(){t.mute(e,o)}),t;if("undefined"==typeof o){if("boolean"!=typeof e)return t._muted;t._muted=e}for(var r=t._getSoundIds(o),d=0;d<r.length;d++){var a=t._soundById(r[d]);a&&(a._muted=e,t._webAudio&&a._node?a._node.gain.setValueAtTime(e?0:a._volume*u.volume(),n.currentTime):a._node&&(a._node.muted=u._muted?!0:e))}return t},volume:function(){var e,o,t=this,r=arguments;if(0===r.length)return t._volume;if(1===r.length){var d=t._getSoundIds(),a=d.indexOf(r[0]);a>=0?o=parseInt(r[0],10):e=parseFloat(r[0])}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var i;if(!("undefined"!=typeof e&&e>=0&&1>=e))return i=o?t._soundById(o):t._sounds[0],i?i._volume:0;if(!t._loaded)return t.once("play",function(){t.volume.apply(t,r)}),t;"undefined"==typeof o&&(t._volume=e),o=t._getSoundIds(o);for(var _=0;_<o.length;_++)i=t._soundById(o[_]),i&&(i._volume=e,t._webAudio&&i._node?i._node.gain.setValueAtTime(e*u.volume(),n.currentTime):i._node&&(i._node.volume=e*u.volume()));return t},fade:function(e,o,t,r){var d=this;if(!d._loaded)return d.once("play",function(){d.fade(e,o,t,r)}),d;d.volume(e,r);for(var u=d._getSoundIds(r),a=0;a<u.length;a++){var i=d._soundById(u[a]);if(i)if(d._webAudio){var _=n.currentTime,s=_+t/1e3;i._volume=e,i._node.gain.setValueAtTime(e,_),i._node.gain.linearRampToValueAtTime(o,s),setTimeout(function(e,t){setTimeout(function(){t._volume=o,d._emit("faded",e)},s-n.currentTime>0?Math.ceil(1e3*(s-n.currentTime)):0)}.bind(d,u[a],i),t)}else{var l=Math.abs(e-o),f=e>o?"out":"in",c=l/.01,p=t/c;!function(){var n=e,t=setInterval(function(e){n+="in"===f?.01:-.01,n=Math.max(0,n),n=Math.min(1,n),n=Math.round(100*n)/100,d.volume(n,e),n===o&&(clearInterval(t),d._emit("faded",e))}.bind(d,u[a]),p)}()}}return d},loop:function(){var e,n,o,t=this,r=arguments;if(0===r.length)return t._loop;if(1===r.length){if("boolean"!=typeof r[0])return o=t._soundById(parseInt(r[0],10)),o?o._loop:!1;e=r[0],t._loop=e}else 2===r.length&&(e=r[0],n=parseInt(r[1],10));for(var d=t._getSoundIds(n),u=0;u<d.length;u++)o=t._soundById(d[u]),o&&(o._loop=e,t._webAudio&&o._node&&(o._node._loop=e));return t},seek:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var d=t._getSoundIds(),u=d.indexOf(r[0]);u>=0?o=parseInt(r[0],10):(o=t._sounds[0]._id,e=parseFloat(r[0]))}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));if("undefined"==typeof o)return t;if(!t._loaded)return t.once("load",function(){t.seek.apply(t,r)}),t;var a=t._soundById(o);if(a){if(!(e>=0))return t._webAudio?a._seek+(t.playing(o)?n.currentTime-a._playStart:0):a._node.currentTime;var i=t.playing(o);i&&t.pause(o,!0),a._seek=e,t._clearTimer(o),i&&t.play(o,!0)}return t},playing:function(e){var n=this,o=n._soundById(e)||n._sounds[0];return o?!o._paused:!1},duration:function(){return this._duration},unload:function(){for(var e=this,n=e._sounds,o=0;o<n.length;o++){n[o]._paused||(e.stop(n[o]._id),e._emit("end",n[o]._id)),e._webAudio||(n[o]._node.src="",n[o]._node.removeEventListener("error",n[o]._errorFn,!1),n[o]._node.removeEventListener("canplaythrough",n[o]._loadFn,!1)),delete n[o]._node,e._clearTimer(n[o]._id);var t=u._howls.indexOf(e);t>=0&&u._howls.splice(t,1)}return _&&delete _[e._src],e=null,null},on:function(e,n,o){var t=this,r=t["_on"+e];return"function"==typeof n&&r.push({id:o,fn:n}),t},off:function(e,n,o){var t=this,r=t["_on"+e];if(n){for(var d=0;d<r.length;d++)if(n===r[d].fn&&o===r[d].id){r.splice(d,1);break}}else r=[];return t},once:function(e,n,o){var t=this,r=function(){n.apply(t,arguments),t.off(e,r,o)};return t.on(e,r,o),t},_emit:function(e,n,o){for(var t=this,r=t["_on"+e],d=0;d<r.length;d++)r[d].id&&r[d].id!==n||setTimeout(function(e){e.call(this,n,o)}.bind(t,r[d].fn),0);return t},_clearTimer:function(e){var n=this;return n._endTimers[e]&&(clearTimeout(n._endTimers[e]),delete n._endTimers[e]),n},_soundById:function(e){for(var n=this,o=0;o<n._sounds.length;o++)if(e===n._sounds[o]._id)return n._sounds[o];return null},_inactiveSound:function(){var e=this;e._drain();for(var n=0;n<e._sounds.length;n++)if(e._sounds[n]._ended)return e._sounds[n].reset();return new i(e)},_drain:function(){var e=this,n=e._pool,o=0,t=0;if(!(e._sounds.length<n)){for(t=0;t<e._sounds.length;t++)e._sounds[t]._ended&&o++;for(t=e._sounds.length-1;t>=0;t--){if(n>=o)return;e._sounds[t]._ended&&(e._webAudio&&e._sounds[t]._node&&e._sounds[t]._node.disconnect(0),e._sounds.splice(t,1),o--)}}},_getSoundIds:function(e){var n=this;if("undefined"==typeof e){for(var o=[],t=0;t<n._sounds.length;t++)o.push(n._sounds[t]._id);return o}return[e]},_refreshBuffer:function(e){var o=this;return e._node.bufferSource=n.createBufferSource(),e._node.bufferSource.buffer=_[o._src],e._node.bufferSource.connect(e._panner?e._panner:e._node),e._node.bufferSource.loop=e._loop,e._loop&&(e._node.bufferSource.loopStart=e._start||0,e._node.bufferSource.loopEnd=e._stop),e._node.bufferSource.playbackRate.value=o._rate,o}};var i=function(e){this._parent=e,this.init()};if(i.prototype={init:function(){var e=this,n=e._parent;return e._muted=n._muted,e._loop=n._loop,e._volume=n._volume,e._muted=n._muted,e._seek=0,e._paused=!0,e._ended=!0,e._id=Math.round(Date.now()*Math.random()),n._sounds.push(e),e.create(),e},create:function(){var e=this,o=e._parent,t=u._muted||e._muted||e._parent._muted?0:e._volume*u.volume();return o._webAudio?(e._node="undefined"==typeof n.createGain?n.createGainNode():n.createGain(),e._node.gain.setValueAtTime(t,n.currentTime),e._node.paused=!0,e._node.connect(r)):(e._node=new Audio,e._errorFn=e._errorListener.bind(e),e._node.addEventListener("error",e._errorFn,!1),e._loadFn=e._loadListener.bind(e),e._node.addEventListener("canplaythrough",e._loadFn,!1),e._node.src=o._src,e._node.preload="auto",e._node.volume=t,e._node.load()),e},reset:function(){var e=this,n=e._parent;return e._muted=n._muted,e._loop=n._loop,e._volume=n._volume,e._muted=n._muted,e._seek=0,e._paused=!0,e._ended=!0,e._sprite=null,e._id=Math.round(Date.now()*Math.random()),e},_errorListener:function(){var e=this;e._node.error&&4===e._node.error.code&&(u.noAudio=!0),e._parent._emit("loaderror",e._id,e._node.error?e._node.error.code:0),e._node.removeEventListener("error",e._errorListener,!1)},_loadListener:function(){var e=this,n=e._parent;n._duration=Math.ceil(10*e._node.duration)/10,0===Object.keys(n._sprite).length&&(n._sprite={__default:[0,1e3*n._duration]}),n._loaded||(n._loaded=!0,n._emit("load")),n._autoplay&&n.play(),e._node.removeEventListener("canplaythrough",e._loadFn,!1)}},o)var _={},s=function(e){var n=e._src;if(_[n])return e._duration=_[n].duration,void c(e);if(/^data:[^;]+;base64,/.test(n)){window.atob=window.atob||function(e){for(var n,o,t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r=String(e).replace(/=+$/,""),d=0,u=0,a="";o=r.charAt(u++);~o&&(n=d%4?64*n+o:o,d++%4)?a+=String.fromCharCode(255&n>>(-2*d&6)):0)o=t.indexOf(o);return a};for(var o=atob(n.split(",")[1]),t=new Uint8Array(o.length),r=0;r<o.length;++r)t[r]=o.charCodeAt(r);f(t.buffer,e)}else{var d=new XMLHttpRequest;d.open("GET",n,!0),d.responseType="arraybuffer",d.onload=function(){f(d.response,e)},d.onerror=function(){e._webAudio&&(e._html5=!0,e._webAudio=!1,e._sounds=[],delete _[n],e.load())},l(d)}},l=function(e){try{e.send()}catch(n){e.onerror()}},f=function(e,o){n.decodeAudioData(e,function(e){e&&(_[o._src]=e,c(o,e))},function(){o._emit("loaderror")})},c=function(e,n){n&&!e._duration&&(e._duration=n.duration),0===Object.keys(e._sprite).length&&(e._sprite={__default:[0,1e3*e._duration]}),e._loaded||(e._loaded=!0,e._emit("load")),e._autoplay&&e.play()};"function"==typeof define&&define.amd&&define("howler",function(){return{Howler:u,Howl:a}}),"undefined"!=typeof exports&&(exports.Howler=u,exports.Howl=a),"undefined"!=typeof window&&(window.HowlerGlobal=d,window.Howler=u,window.Howl=a,window.Sound=i)}();

    var Task = Elm.Native.Task.make(localRuntime);
    var Maybe = Elm.Maybe.make(localRuntime);
    var Dict = Elm.Dict.make(localRuntime);
    var Utils = Elm.Native.Utils.make(localRuntime);
    var List = Elm.Native.List.make(localRuntime);

    var sounds = window.sounds = {};

    function create(soundLabel, audioObj) {
        return Task.asyncFunction(function(callback) {

            var makeSpriteObj = function(dict) {

                if(!dict) return dict;

                var dictArray = List.toArray(Dict.toList(dict));
                var dictObj = {};

                for(var i in dictArray) {
                    var key = dictArray[i]._0;
                    var tuple = dictArray[i]._1;
                    dictObj[key] = [tuple._0, tuple._1, tuple._2];
                }

                return dictObj;
            }

            var soundObject = { soundLabel: soundLabel, playId: Maybe.Nothing };

            var howlObj = {
                src: List.toArray(audioObj.src),
                loop: audioObj.loop._0,
                volume: audioObj.volume._0,
                html5: audioObj.html5._0,
                sprite: makeSpriteObj(audioObj.sprite._0),
                rate: audioObj.rate._0,
                pool: audioObj.pool._0,
                onloaderror: function() { return callback(Task.fail("404 - Audio source not found.")); },
                onload: function() { return callback(Task.succeed(soundObject)); },
            }

            var newHowl = new Howl(howlObj);

            sounds[soundLabel] = newHowl;
        });
    }

    function play(spriteLabel, soundObject) {
        return Task.asyncFunction(function(callback) {
            try {

                // console.log(soundObject.soundLabel, soundObject.playId._0, "start")
                if(!sounds[soundObject.soundLabel]) return callback(Task.fail("No such sound object."));

                var sound = sounds[soundObject.soundLabel];
                var playId = soundObject.playId._0;
                var sprite = spriteLabel._0;

                var newPlayId;
                if(sprite != null)
                    newPlayId = sound.play(sprite);
                else
                    newPlayId = (playId == null) ? sound.play() : sound.play(playId);

                return callback(Task.succeed({soundLabel: soundObject.soundLabel, playId: Maybe.Just(newPlayId)}));
            } catch(e) {
                return callback(Task.fail("Failed to play sound."));
            }
        });
    }

    var setWith0 = function(field) {
        return (function(soundObject) {
            return Task.asyncFunction(function(callback) {
                try {
                    // console.log(soundObject.soundLabel, soundObject.playId._0, field)
                    if(!sounds[soundObject.soundLabel]) return callback(Task.fail("No such sound object."));

                    var sound = sounds[soundObject.soundLabel];
                    var playId = soundObject.playId._0;

                    (playId == null) ? sound[field]() : sound[field](playId);

                    return callback(Task.succeed(soundObject));
                } catch(e) {
                    return callback(Task.fail("Failure to modify: " + field));
                }
            });
        });
    }

    var setWith1 = function(field) {
        return F2(function(val, soundObject) {
            return Task.asyncFunction(function(callback) {
                try {
                    if(!sounds[soundObject.soundLabel]) return callback(Task.fail("No such sound object."));

                    var sound = sounds[soundObject.soundLabel];
                    var playId = soundObject.playId._0;

                    (playId == null) ? sound[field](val) : sound[field](val, playId);

                    return callback(Task.succeed(soundObject));
                } catch(e) {
                    return callback(Task.fail("Failure to modify: " + field));
                }
            });
        });
    }

    var get = function(field) {
        return (function(soundObject) {
            return Task.asyncFunction(function(callback) {
                try {
                    if(!sounds[soundObject.soundLabel]) return callback(Task.fail("No such sound object."));

                    var sound = sounds[soundObject.soundLabel];
                    var playId = soundObject.playId._0;

                    var result = (playId == null) ? sound[field]() : sound[field](playId);

                    return callback(Task.succeed(result));
                } catch(e) {
                    return callback(Task.fail("Failure to get: " + field));
                }
            });
        });
    }

    function fade(from, to, duration, soundObject) {
        return Task.asyncFunction(function(callback) {
            try {
                if(!sounds[soundObject.soundLabel]) return callback(Task.fail("No such sound object."));

                var sound = sounds[soundObject.soundLabel];
                var playId = soundObject.playId._0;

                (playId == null) ? sound.fade(from, to, duration) : sound.fade(from, to, duration, playId);

                return callback(Task.succeed(soundObject));
            } catch(e) {
                return callback(Task.fail("Failure to fade sound."));
            }
        });
    }

    // function on(eventStr, fn, soundObject) {
    //     return Task.asyncFunction(function(callback) {
    //         try {
    //             if(!sounds[soundObject.soundLabel]) return callback(Task.fail("No such sound object."));

    //             var sound = sounds[soundObject.soundLabel];
    //             var playId = soundObject.playId._0;

    //             var eventHandler = function() { Task.perform(fn()); }

    //             (playId == null) ? sound.on(eventStr, eventHandler) : sound.on(eventStr, eventHandler, playId);

    //             return callback(Task.succeed(soundObject));
    //         } catch(e) {
    //             debugger;
    //             return callback(Task.fail("Failure to add listener."));
    //         }
    //     });
    // }

    return localRuntime.Native.Howler.values = {
        create: F2(create),
        play: F2(play),
        pause: setWith0("pause"),
        stop: setWith0("stop"),
        mute: setWith1("mute"),
        volume: setWith1("volume"),
        seek: setWith1("seek"),
        loop: setWith1("loop"),
        fade: F4(fade),
        isMuted: get("mute"),
        getVolume: get("volume"),
        getSeek: get("seek"),
        isLooping: get("loop"),
        isPlaying: get("playing"),
        getDuration: get("duration")
        // on: F3(on)
    };
};

Elm.Native.Json = {};
Elm.Native.Json.make = function(localRuntime) {

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Json = localRuntime.Native.Json || {};
	if (localRuntime.Native.Json.values) {
		return localRuntime.Native.Json.values;
	}

	var ElmArray = Elm.Native.Array.make(localRuntime);
	var List = Elm.Native.List.make(localRuntime);
	var Maybe = Elm.Maybe.make(localRuntime);
	var Result = Elm.Result.make(localRuntime);
	var Utils = Elm.Native.Utils.make(localRuntime);


	function crash(expected, actual) {
		throw new Error(
			'expecting ' + expected + ' but got ' + JSON.stringify(actual)
		);
	}


	// PRIMITIVE VALUES

	function decodeNull(successValue) {
		return function(value) {
			if (value === null) {
				return successValue;
			}
			crash('null', value);
		};
	}


	function decodeString(value) {
		if (typeof value === 'string' || value instanceof String) {
			return value;
		}
		crash('a String', value);
	}


	function decodeFloat(value) {
		if (typeof value === 'number') {
			return value;
		}
		crash('a Float', value);
	}


	function decodeInt(value) {
		if (typeof value === 'number' && (value|0) === value) {
			return value;
		}
		crash('an Int', value);
	}


	function decodeBool(value) {
		if (typeof value === 'boolean') {
			return value;
		}
		crash('a Bool', value);
	}


	// ARRAY

	function decodeArray(decoder) {
		return function(value) {
			if (value instanceof Array) {
				var len = value.length;
				var array = new Array(len);
				for (var i = len; i-- ; ) {
					array[i] = decoder(value[i]);
				}
				return ElmArray.fromJSArray(array);
			}
			crash('an Array', value);
		};
	}


	// LIST

	function decodeList(decoder) {
		return function(value) {
			if (value instanceof Array) {
				var len = value.length;
				var list = List.Nil;
				for (var i = len; i-- ; ) {
					list = List.Cons( decoder(value[i]), list );
				}
				return list;
			}
			crash('a List', value);
		};
	}


	// MAYBE

	function decodeMaybe(decoder) {
		return function(value) {
			try {
				return Maybe.Just(decoder(value));
			} catch(e) {
				return Maybe.Nothing;
			}
		};
	}


	// FIELDS

	function decodeField(field, decoder) {
		return function(value) {
			var subValue = value[field];
			if (subValue !== undefined) {
				return decoder(subValue);
			}
			crash("an object with field '" + field + "'", value);
		};
	}


	// OBJECTS

	function decodeKeyValuePairs(decoder) {
		return function(value) {
			var isObject =
				typeof value === 'object'
					&& value !== null
					&& !(value instanceof Array);

			if (isObject) {
				var keyValuePairs = List.Nil;
				for (var key in value) {
					var elmValue = decoder(value[key]);
					var pair = Utils.Tuple2(key, elmValue);
					keyValuePairs = List.Cons(pair, keyValuePairs);
				}
				return keyValuePairs;
			}

			crash("an object", value);
		};
	}

	function decodeObject1(f, d1) {
		return function(value) {
			return f(d1(value));
		};
	}

	function decodeObject2(f, d1, d2) {
		return function(value) {
			return A2( f, d1(value), d2(value) );
		};
	}

	function decodeObject3(f, d1, d2, d3) {
		return function(value) {
			return A3( f, d1(value), d2(value), d3(value) );
		};
	}

	function decodeObject4(f, d1, d2, d3, d4) {
		return function(value) {
			return A4( f, d1(value), d2(value), d3(value), d4(value) );
		};
	}

	function decodeObject5(f, d1, d2, d3, d4, d5) {
		return function(value) {
			return A5( f, d1(value), d2(value), d3(value), d4(value), d5(value) );
		};
	}

	function decodeObject6(f, d1, d2, d3, d4, d5, d6) {
		return function(value) {
			return A6( f,
				d1(value),
				d2(value),
				d3(value),
				d4(value),
				d5(value),
				d6(value)
			);
		};
	}

	function decodeObject7(f, d1, d2, d3, d4, d5, d6, d7) {
		return function(value) {
			return A7( f,
				d1(value),
				d2(value),
				d3(value),
				d4(value),
				d5(value),
				d6(value),
				d7(value)
			);
		};
	}

	function decodeObject8(f, d1, d2, d3, d4, d5, d6, d7, d8) {
		return function(value) {
			return A8( f,
				d1(value),
				d2(value),
				d3(value),
				d4(value),
				d5(value),
				d6(value),
				d7(value),
				d8(value)
			);
		};
	}


	// TUPLES

	function decodeTuple1(f, d1) {
		return function(value) {
			if ( !(value instanceof Array) || value.length !== 1 ) {
				crash('a Tuple of length 1', value);
			}
			return f( d1(value[0]) );
		};
	}

	function decodeTuple2(f, d1, d2) {
		return function(value) {
			if ( !(value instanceof Array) || value.length !== 2 ) {
				crash('a Tuple of length 2', value);
			}
			return A2( f, d1(value[0]), d2(value[1]) );
		};
	}

	function decodeTuple3(f, d1, d2, d3) {
		return function(value) {
			if ( !(value instanceof Array) || value.length !== 3 ) {
				crash('a Tuple of length 3', value);
			}
			return A3( f, d1(value[0]), d2(value[1]), d3(value[2]) );
		};
	}


	function decodeTuple4(f, d1, d2, d3, d4) {
		return function(value) {
			if ( !(value instanceof Array) || value.length !== 4 ) {
				crash('a Tuple of length 4', value);
			}
			return A4( f, d1(value[0]), d2(value[1]), d3(value[2]), d4(value[3]) );
		};
	}


	function decodeTuple5(f, d1, d2, d3, d4, d5) {
		return function(value) {
			if ( !(value instanceof Array) || value.length !== 5 ) {
				crash('a Tuple of length 5', value);
			}
			return A5( f,
				d1(value[0]),
				d2(value[1]),
				d3(value[2]),
				d4(value[3]),
				d5(value[4])
			);
		};
	}


	function decodeTuple6(f, d1, d2, d3, d4, d5, d6) {
		return function(value) {
			if ( !(value instanceof Array) || value.length !== 6 ) {
				crash('a Tuple of length 6', value);
			}
			return A6( f,
				d1(value[0]),
				d2(value[1]),
				d3(value[2]),
				d4(value[3]),
				d5(value[4]),
				d6(value[5])
			);
		};
	}

	function decodeTuple7(f, d1, d2, d3, d4, d5, d6, d7) {
		return function(value) {
			if ( !(value instanceof Array) || value.length !== 7 ) {
				crash('a Tuple of length 7', value);
			}
			return A7( f,
				d1(value[0]),
				d2(value[1]),
				d3(value[2]),
				d4(value[3]),
				d5(value[4]),
				d6(value[5]),
				d7(value[6])
			);
		};
	}


	function decodeTuple8(f, d1, d2, d3, d4, d5, d6, d7, d8) {
		return function(value) {
			if ( !(value instanceof Array) || value.length !== 8 ) {
				crash('a Tuple of length 8', value);
			}
			return A8( f,
				d1(value[0]),
				d2(value[1]),
				d3(value[2]),
				d4(value[3]),
				d5(value[4]),
				d6(value[5]),
				d7(value[6]),
				d8(value[7])
			);
		};
	}


	// CUSTOM DECODERS

	function decodeValue(value) {
		return value;
	}

	function runDecoderValue(decoder, value) {
		try {
			return Result.Ok(decoder(value));
		} catch(e) {
			return Result.Err(e.message);
		}
	}

	function customDecoder(decoder, callback) {
		return function(value) {
			var result = callback(decoder(value));
			if (result.ctor === 'Err') {
				throw new Error('custom decoder failed: ' + result._0);
			}
			return result._0;
		}
	}

	function andThen(decode, callback) {
		return function(value) {
			var result = decode(value);
			return callback(result)(value);
		}
	}

	function fail(msg) {
		return function(value) {
			throw new Error(msg);
		}
	}

	function succeed(successValue) {
		return function(value) {
			return successValue;
		}
	}


	// ONE OF MANY

	function oneOf(decoders) {
		return function(value) {
			var errors = [];
			var temp = decoders;
			while (temp.ctor !== '[]') {
				try {
					return temp._0(value);
				} catch(e) {
					errors.push(e.message);
				}
				temp = temp._1;
			}
			throw new Error('expecting one of the following:\n    ' + errors.join('\n    '));
		}
	}

	function get(decoder, value) {
		try {
			return Result.Ok(decoder(value));
		} catch(e) {
			return Result.Err(e.message);
		}
	}


	// ENCODE / DECODE

	function runDecoderString(decoder, string) {
		try {
			return Result.Ok(decoder(JSON.parse(string)));
		} catch(e) {
			return Result.Err(e.message);
		}
	}

	function encode(indentLevel, value) {
		return JSON.stringify(value, null, indentLevel);
	}

	function identity(value) {
		return value;
	}

	function encodeObject(keyValuePairs) {
		var obj = {};
		while (keyValuePairs.ctor !== '[]') {
			var pair = keyValuePairs._0;
			obj[pair._0] = pair._1;
			keyValuePairs = keyValuePairs._1;
		}
		return obj;
	}

	return localRuntime.Native.Json.values = {
		encode: F2(encode),
		runDecoderString: F2(runDecoderString),
		runDecoderValue: F2(runDecoderValue),

		get: F2(get),
		oneOf: oneOf,

		decodeNull: decodeNull,
		decodeInt: decodeInt,
		decodeFloat: decodeFloat,
		decodeString: decodeString,
		decodeBool: decodeBool,

		decodeMaybe: decodeMaybe,

		decodeList: decodeList,
		decodeArray: decodeArray,

		decodeField: F2(decodeField),

		decodeObject1: F2(decodeObject1),
		decodeObject2: F3(decodeObject2),
		decodeObject3: F4(decodeObject3),
		decodeObject4: F5(decodeObject4),
		decodeObject5: F6(decodeObject5),
		decodeObject6: F7(decodeObject6),
		decodeObject7: F8(decodeObject7),
		decodeObject8: F9(decodeObject8),
		decodeKeyValuePairs: decodeKeyValuePairs,

		decodeTuple1: F2(decodeTuple1),
		decodeTuple2: F3(decodeTuple2),
		decodeTuple3: F4(decodeTuple3),
		decodeTuple4: F5(decodeTuple4),
		decodeTuple5: F6(decodeTuple5),
		decodeTuple6: F7(decodeTuple6),
		decodeTuple7: F8(decodeTuple7),
		decodeTuple8: F9(decodeTuple8),

		andThen: F2(andThen),
		decodeValue: decodeValue,
		customDecoder: F2(customDecoder),
		fail: fail,
		succeed: succeed,

		identity: identity,
		encodeNull: null,
		encodeArray: ElmArray.toJSArray,
		encodeList: List.toArray,
		encodeObject: encodeObject

	};

};

Elm.Native.List = {};
Elm.Native.List.make = function(localRuntime) {
	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.List = localRuntime.Native.List || {};
	if (localRuntime.Native.List.values)
	{
		return localRuntime.Native.List.values;
	}
	if ('values' in Elm.Native.List)
	{
		return localRuntime.Native.List.values = Elm.Native.List.values;
	}

	var Utils = Elm.Native.Utils.make(localRuntime);

	var Nil = Utils.Nil;
	var Cons = Utils.Cons;

	function toArray(xs)
	{
		var out = [];
		while (xs.ctor !== '[]')
		{
			out.push(xs._0);
			xs = xs._1;
		}
		return out;
	}

	function fromArray(arr)
	{
		var out = Nil;
		for (var i = arr.length; i--; )
		{
			out = Cons(arr[i], out);
		}
		return out;
	}

	function range(lo,hi)
	{
		var lst = Nil;
		if (lo <= hi)
		{
			do { lst = Cons(hi,lst) } while (hi-->lo);
		}
		return lst
	}

	// f defined similarly for both foldl and foldr (NB: different from Haskell)
	// ie, foldl : (a -> b -> b) -> b -> [a] -> b
	function foldl(f, b, xs)
	{
		var acc = b;
		while (xs.ctor !== '[]')
		{
			acc = A2(f, xs._0, acc);
			xs = xs._1;
		}
		return acc;
	}

	function foldr(f, b, xs)
	{
		var arr = toArray(xs);
		var acc = b;
		for (var i = arr.length; i--; )
		{
			acc = A2(f, arr[i], acc);
		}
		return acc;
	}

	function any(pred, xs)
	{
		while (xs.ctor !== '[]')
		{
			if (pred(xs._0))
			{
				return true;
			}
			xs = xs._1;
		}
		return false;
	}

	function map2(f, xs, ys)
	{
		var arr = [];
		while (xs.ctor !== '[]' && ys.ctor !== '[]')
		{
			arr.push(A2(f, xs._0, ys._0));
			xs = xs._1;
			ys = ys._1;
		}
		return fromArray(arr);
	}

	function map3(f, xs, ys, zs)
	{
		var arr = [];
		while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]')
		{
			arr.push(A3(f, xs._0, ys._0, zs._0));
			xs = xs._1;
			ys = ys._1;
			zs = zs._1;
		}
		return fromArray(arr);
	}

	function map4(f, ws, xs, ys, zs)
	{
		var arr = [];
		while (   ws.ctor !== '[]'
			   && xs.ctor !== '[]'
			   && ys.ctor !== '[]'
			   && zs.ctor !== '[]')
		{
			arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
			ws = ws._1;
			xs = xs._1;
			ys = ys._1;
			zs = zs._1;
		}
		return fromArray(arr);
	}

	function map5(f, vs, ws, xs, ys, zs)
	{
		var arr = [];
		while (   vs.ctor !== '[]'
			   && ws.ctor !== '[]'
			   && xs.ctor !== '[]'
			   && ys.ctor !== '[]'
			   && zs.ctor !== '[]')
		{
			arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
			vs = vs._1;
			ws = ws._1;
			xs = xs._1;
			ys = ys._1;
			zs = zs._1;
		}
		return fromArray(arr);
	}

	function sortBy(f, xs)
	{
		return fromArray(toArray(xs).sort(function(a,b){
			return Utils.cmp(f(a), f(b));
		}));
	}

	function sortWith(f, xs)
	{
		return fromArray(toArray(xs).sort(function(a,b){
			var ord = f(a)(b).ctor;
			return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
		}));
	}

	function take(n, xs)
	{
		var arr = [];
		while (xs.ctor !== '[]' && n > 0)
		{
			arr.push(xs._0);
			xs = xs._1;
			--n;
		}
		return fromArray(arr);
	}

	function drop(n, xs)
	{
		while (xs.ctor !== '[]' && n > 0)
		{
			xs = xs._1;
			--n;
		}
		return xs;
	}

	function repeat(n, x)
	{
		var arr = [];
		var pattern = [x];
		while (n > 0)
		{
			if (n & 1)
			{
				arr = arr.concat(pattern);
			}
			n >>= 1, pattern = pattern.concat(pattern);
		}
		return fromArray(arr);
	}


	Elm.Native.List.values = {
		Nil:Nil,
		Cons:Cons,
		cons:F2(Cons),
		toArray:toArray,
		fromArray:fromArray,
		range:range,

		foldl:F3(foldl),
		foldr:F3(foldr),

		any:F2(any),
		map2:F3(map2),
		map3:F4(map3),
		map4:F5(map4),
		map5:F6(map5),
		sortBy:F2(sortBy),
		sortWith:F2(sortWith),
		take:F2(take),
		drop:F2(drop),
		repeat:F2(repeat)
	};
	return localRuntime.Native.List.values = Elm.Native.List.values;

};


// setup
Elm.Native = Elm.Native || {};
Elm.Native.Markdown = Elm.Native.Markdown || {};

// definition
Elm.Native.Markdown.make = function(localRuntime) {
	'use strict';

	// attempt to short-circuit
	if ('values' in Elm.Native.Markdown)
	{
		return Elm.Native.Markdown.values;
	}

	var Element = Elm.Native.Graphics.Element.make(localRuntime);

	/**
	 * marked - a markdown parser
	 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
	 * https://github.com/chjj/marked
	 */
	(function(){var block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:noop,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:noop,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment|closed|closing) *(?:\n{2,}|\s*$)/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:noop,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};block.bullet=/(?:[*+-]|\d+\.)/;block.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item=replace(block.item,"gm")(/bull/g,block.bullet)();block.list=replace(block.list)(/bull/g,block.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+block.def.source+")")();block.blockquote=replace(block.blockquote)("def",block.def)();block._tag="(?!(?:"+"a|em|strong|small|s|cite|q|dfn|abbr|data|time|code"+"|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo"+"|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";block.html=replace(block.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,block._tag)();block.paragraph=replace(block.paragraph)("hr",block.hr)("heading",block.heading)("lheading",block.lheading)("blockquote",block.blockquote)("tag","<"+block._tag)("def",block.def)();block.normal=merge({},block);block.gfm=merge({},block.normal,{fences:/^ *(`{3,}|~{3,}) *(\S+)? *\n([\s\S]+?)\s*\1 *(?:\n+|$)/,paragraph:/^/});block.gfm.paragraph=replace(block.paragraph)("(?!","(?!"+block.gfm.fences.source.replace("\\1","\\2")+"|"+block.list.source.replace("\\1","\\3")+"|")();block.tables=merge({},block.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/});function Lexer(options){this.tokens=[];this.tokens.links={};this.options=options||marked.defaults;this.rules=block.normal;if(this.options.gfm){if(this.options.tables){this.rules=block.tables}else{this.rules=block.gfm}}}Lexer.rules=block;Lexer.lex=function(src,options){var lexer=new Lexer(options);return lexer.lex(src)};Lexer.prototype.lex=function(src){src=src.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n");return this.token(src,true)};Lexer.prototype.token=function(src,top,bq){var src=src.replace(/^ +$/gm,""),next,loose,cap,bull,b,item,space,i,l;while(src){if(cap=this.rules.newline.exec(src)){src=src.substring(cap[0].length);if(cap[0].length>1){this.tokens.push({type:"space"})}}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);cap=cap[0].replace(/^ {4}/gm,"");this.tokens.push({type:"code",text:!this.options.pedantic?cap.replace(/\n+$/,""):cap});continue}if(cap=this.rules.fences.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"code",lang:cap[2],text:cap[3]});continue}if(cap=this.rules.heading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[1].length,text:cap[2]});continue}if(top&&(cap=this.rules.nptable.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].split(/ *\| */)}this.tokens.push(item);continue}if(cap=this.rules.lheading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[2]==="="?1:2,text:cap[1]});continue}if(cap=this.rules.hr.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"hr"});continue}if(cap=this.rules.blockquote.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"blockquote_start"});cap=cap[0].replace(/^ *> ?/gm,"");this.token(cap,top,true);this.tokens.push({type:"blockquote_end"});continue}if(cap=this.rules.list.exec(src)){src=src.substring(cap[0].length);bull=cap[2];this.tokens.push({type:"list_start",ordered:bull.length>1});cap=cap[0].match(this.rules.item);next=false;l=cap.length;i=0;for(;i<l;i++){item=cap[i];space=item.length;item=item.replace(/^ *([*+-]|\d+\.) +/,"");if(~item.indexOf("\n ")){space-=item.length;item=!this.options.pedantic?item.replace(new RegExp("^ {1,"+space+"}","gm"),""):item.replace(/^ {1,4}/gm,"")}if(this.options.smartLists&&i!==l-1){b=block.bullet.exec(cap[i+1])[0];if(bull!==b&&!(bull.length>1&&b.length>1)){src=cap.slice(i+1).join("\n")+src;i=l-1}}loose=next||/\n\n(?!\s*$)/.test(item);if(i!==l-1){next=item.charAt(item.length-1)==="\n";if(!loose)loose=next}this.tokens.push({type:loose?"loose_item_start":"list_item_start"});this.token(item,false,bq);this.tokens.push({type:"list_item_end"})}this.tokens.push({type:"list_end"});continue}if(cap=this.rules.html.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:cap[1]==="pre"||cap[1]==="script"||cap[1]==="style",text:cap[0]});continue}if(!bq&&top&&(cap=this.rules.def.exec(src))){src=src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()]={href:cap[2],title:cap[3]};continue}if(top&&(cap=this.rules.table.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */)}this.tokens.push(item);continue}if(top&&(cap=this.rules.paragraph.exec(src))){src=src.substring(cap[0].length);this.tokens.push({type:"paragraph",text:cap[1].charAt(cap[1].length-1)==="\n"?cap[1].slice(0,-1):cap[1]});continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"text",text:cap[0]});continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return this.tokens};var inline={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:noop,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:__|[\s\S])+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:noop,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};inline._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link=replace(inline.link)("inside",inline._inside)("href",inline._href)();inline.reflink=replace(inline.reflink)("inside",inline._inside)();inline.normal=merge({},inline);inline.pedantic=merge({},inline.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/});inline.gfm=merge({},inline.normal,{escape:replace(inline.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:replace(inline.text)("]|","~]|")("|","|https?://|")()});inline.breaks=merge({},inline.gfm,{br:replace(inline.br)("{2,}","*")(),text:replace(inline.gfm.text)("{2,}","*")()});function InlineLexer(links,options){this.options=options||marked.defaults;this.links=links;this.rules=inline.normal;this.renderer=this.options.renderer||new Renderer;this.renderer.options=this.options;if(!this.links){throw new Error("Tokens array requires a `links` property.")}if(this.options.gfm){if(this.options.breaks){this.rules=inline.breaks}else{this.rules=inline.gfm}}else if(this.options.pedantic){this.rules=inline.pedantic}}InlineLexer.rules=inline;InlineLexer.output=function(src,links,options){var inline=new InlineLexer(links,options);return inline.output(src)};InlineLexer.prototype.output=function(src){var out="",link,text,href,cap;while(src){if(cap=this.rules.escape.exec(src)){src=src.substring(cap[0].length);out+=cap[1];continue}if(cap=this.rules.autolink.exec(src)){src=src.substring(cap[0].length);if(cap[2]==="@"){text=cap[1].charAt(6)===":"?this.mangle(cap[1].substring(7)):this.mangle(cap[1]);href=this.mangle("mailto:")+text}else{text=escape(cap[1]);href=text}out+=this.renderer.link(href,null,text);continue}if(!this.inLink&&(cap=this.rules.url.exec(src))){src=src.substring(cap[0].length);text=escape(cap[1]);href=text;out+=this.renderer.link(href,null,text);continue}if(cap=this.rules.tag.exec(src)){if(!this.inLink&&/^<a /i.test(cap[0])){this.inLink=true}else if(this.inLink&&/^<\/a>/i.test(cap[0])){this.inLink=false}src=src.substring(cap[0].length);out+=this.options.sanitize?escape(cap[0]):cap[0];continue}if(cap=this.rules.link.exec(src)){src=src.substring(cap[0].length);this.inLink=true;out+=this.outputLink(cap,{href:cap[2],title:cap[3]});this.inLink=false;continue}if((cap=this.rules.reflink.exec(src))||(cap=this.rules.nolink.exec(src))){src=src.substring(cap[0].length);link=(cap[2]||cap[1]).replace(/\s+/g," ");link=this.links[link.toLowerCase()];if(!link||!link.href){out+=cap[0].charAt(0);src=cap[0].substring(1)+src;continue}this.inLink=true;out+=this.outputLink(cap,link);this.inLink=false;continue}if(cap=this.rules.strong.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.strong(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.em.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.em(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.codespan(escape(cap[2],true));continue}if(cap=this.rules.br.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.br();continue}if(cap=this.rules.del.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.del(this.output(cap[1]));continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);out+=escape(this.smartypants(cap[0]));continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return out};InlineLexer.prototype.outputLink=function(cap,link){var href=escape(link.href),title=link.title?escape(link.title):null;return cap[0].charAt(0)!=="!"?this.renderer.link(href,title,this.output(cap[1])):this.renderer.image(href,title,escape(cap[1]))};InlineLexer.prototype.smartypants=function(text){if(!this.options.smartypants)return text;return text.replace(/--/g,"—").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")};InlineLexer.prototype.mangle=function(text){var out="",l=text.length,i=0,ch;for(;i<l;i++){ch=text.charCodeAt(i);if(Math.random()>.5){ch="x"+ch.toString(16)}out+="&#"+ch+";"}return out};function Renderer(options){this.options=options||{}}Renderer.prototype.code=function(code,lang,escaped){if(this.options.highlight){var out=this.options.highlight(code,lang);if(out!=null&&out!==code){escaped=true;code=out}}if(!lang){return"<pre><code>"+(escaped?code:escape(code,true))+"\n</code></pre>"}return'<pre><code class="'+this.options.langPrefix+escape(lang,true)+'">'+(escaped?code:escape(code,true))+"\n</code></pre>\n"};Renderer.prototype.blockquote=function(quote){return"<blockquote>\n"+quote+"</blockquote>\n"};Renderer.prototype.html=function(html){return html};Renderer.prototype.heading=function(text,level,raw){return"<h"+level+' id="'+this.options.headerPrefix+raw.toLowerCase().replace(/[^\w]+/g,"-")+'">'+text+"</h"+level+">\n"};Renderer.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"};Renderer.prototype.list=function(body,ordered){var type=ordered?"ol":"ul";return"<"+type+">\n"+body+"</"+type+">\n"};Renderer.prototype.listitem=function(text){return"<li>"+text+"</li>\n"};Renderer.prototype.paragraph=function(text){return"<p>"+text+"</p>\n"};Renderer.prototype.table=function(header,body){return"<table>\n"+"<thead>\n"+header+"</thead>\n"+"<tbody>\n"+body+"</tbody>\n"+"</table>\n"};Renderer.prototype.tablerow=function(content){return"<tr>\n"+content+"</tr>\n"};Renderer.prototype.tablecell=function(content,flags){var type=flags.header?"th":"td";var tag=flags.align?"<"+type+' style="text-align:'+flags.align+'">':"<"+type+">";return tag+content+"</"+type+">\n"};Renderer.prototype.strong=function(text){return"<strong>"+text+"</strong>"};Renderer.prototype.em=function(text){return"<em>"+text+"</em>"};Renderer.prototype.codespan=function(text){return"<code>"+text+"</code>"};Renderer.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"};Renderer.prototype.del=function(text){return"<del>"+text+"</del>"};Renderer.prototype.link=function(href,title,text){if(this.options.sanitize){try{var prot=decodeURIComponent(unescape(href)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(prot.indexOf("javascript:")===0){return""}}var out='<a href="'+href+'"';if(title){out+=' title="'+title+'"'}out+=">"+text+"</a>";return out};Renderer.prototype.image=function(href,title,text){var out='<img src="'+href+'" alt="'+text+'"';if(title){out+=' title="'+title+'"'}out+=this.options.xhtml?"/>":">";return out};function Parser(options){this.tokens=[];this.token=null;this.options=options||marked.defaults;this.options.renderer=this.options.renderer||new Renderer;this.renderer=this.options.renderer;this.renderer.options=this.options}Parser.parse=function(src,options,renderer){var parser=new Parser(options,renderer);return parser.parse(src)};Parser.prototype.parse=function(src){this.inline=new InlineLexer(src.links,this.options,this.renderer);this.tokens=src.reverse();var out="";while(this.next()){out+=this.tok()}return out};Parser.prototype.next=function(){return this.token=this.tokens.pop()};Parser.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0};Parser.prototype.parseText=function(){var body=this.token.text;while(this.peek().type==="text"){body+="\n"+this.next().text}return this.inline.output(body)};Parser.prototype.tok=function(){switch(this.token.type){case"space":{return""}case"hr":{return this.renderer.hr()}case"heading":{return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text)}case"code":{return this.renderer.code(this.token.text,this.token.lang,this.token.escaped)}case"table":{var header="",body="",i,row,cell,flags,j;cell="";for(i=0;i<this.token.header.length;i++){flags={header:true,align:this.token.align[i]};cell+=this.renderer.tablecell(this.inline.output(this.token.header[i]),{header:true,align:this.token.align[i]})}header+=this.renderer.tablerow(cell);for(i=0;i<this.token.cells.length;i++){row=this.token.cells[i];cell="";for(j=0;j<row.length;j++){cell+=this.renderer.tablecell(this.inline.output(row[j]),{header:false,align:this.token.align[j]})}body+=this.renderer.tablerow(cell)}return this.renderer.table(header,body)}case"blockquote_start":{var body="";while(this.next().type!=="blockquote_end"){body+=this.tok()}return this.renderer.blockquote(body)}case"list_start":{var body="",ordered=this.token.ordered;while(this.next().type!=="list_end"){body+=this.tok()}return this.renderer.list(body,ordered)}case"list_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.token.type==="text"?this.parseText():this.tok()}return this.renderer.listitem(body)}case"loose_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.tok()}return this.renderer.listitem(body)}case"html":{var html=!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text;return this.renderer.html(html)}case"paragraph":{return this.renderer.paragraph(this.inline.output(this.token.text))}case"text":{return this.renderer.paragraph(this.parseText())}}};function escape(html,encode){return html.replace(!encode?/&(?!#?\w+;)/g:/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function unescape(html){return html.replace(/&([#\w]+);/g,function(_,n){n=n.toLowerCase();if(n==="colon")return":";if(n.charAt(0)==="#"){return n.charAt(1)==="x"?String.fromCharCode(parseInt(n.substring(2),16)):String.fromCharCode(+n.substring(1))}return""})}function replace(regex,opt){regex=regex.source;opt=opt||"";return function self(name,val){if(!name)return new RegExp(regex,opt);val=val.source||val;val=val.replace(/(^|[^\[])\^/g,"$1");regex=regex.replace(name,val);return self}}function noop(){}noop.exec=noop;function merge(obj){var i=1,target,key;for(;i<arguments.length;i++){target=arguments[i];for(key in target){if(Object.prototype.hasOwnProperty.call(target,key)){obj[key]=target[key]}}}return obj}function marked(src,opt,callback){if(callback||typeof opt==="function"){if(!callback){callback=opt;opt=null}opt=merge({},marked.defaults,opt||{});var highlight=opt.highlight,tokens,pending,i=0;try{tokens=Lexer.lex(src,opt)}catch(e){return callback(e)}pending=tokens.length;var done=function(err){if(err){opt.highlight=highlight;return callback(err)}var out;try{out=Parser.parse(tokens,opt)}catch(e){err=e}opt.highlight=highlight;return err?callback(err):callback(null,out)};if(!highlight||highlight.length<3){return done()}delete opt.highlight;if(!pending)return done();for(;i<tokens.length;i++){(function(token){if(token.type!=="code"){return--pending||done()}return highlight(token.text,token.lang,function(err,code){if(err)return done(err);if(code==null||code===token.text){return--pending||done()}token.text=code;token.escaped=true;--pending||done()})})(tokens[i])}return}try{if(opt)opt=merge({},marked.defaults,opt);return Parser.parse(Lexer.lex(src,opt),opt)}catch(e){e.message+="\nPlease report this to https://github.com/chjj/marked.";if((opt||marked.defaults).silent){return"<p>An error occured:</p><pre>"+escape(e.message+"",true)+"</pre>"}throw e}}marked.options=marked.setOptions=function(opt){merge(marked.defaults,opt);return marked};marked.defaults={gfm:true,tables:true,breaks:false,pedantic:false,sanitize:false,smartLists:false,silent:false,highlight:null,langPrefix:"lang-",smartypants:false,headerPrefix:"",renderer:new Renderer,xhtml:false};marked.Parser=Parser;marked.parser=Parser.parse;marked.Renderer=Renderer;marked.Lexer=Lexer;marked.lexer=Lexer.lex;marked.InlineLexer=InlineLexer;marked.inlineLexer=InlineLexer.output;marked.parse=marked;if(typeof module!=="undefined"&&typeof exports==="object"){module.exports=marked}else if(typeof define==="function"&&define.amd){define(function(){return marked})}else{this.marked=marked}}).call(function(){return this||(typeof window!=="undefined"?window:global)}());

	marked.setOptions({
		highlight: function (code, lang) {
			if (typeof hljs !== 'undefined'
				&& lang
				&& hljs.listLanguages().indexOf(lang) >= 0)
			{
				return hljs.highlight(lang, code, true).value;
			}
			return code;
		}
	});

	function formatOptions(options) {
		var gfm = options.githubFlavored;
		if (gfm.ctor === 'Just')
		{
			return {
				gfm: true,
				tables: gfm.tables,
				breaks: gfm.breaks,
				sanitize: options.sanitize,
				smartypants: options.smartypants
			};
		}
		else
		{
			return {
				gfm: false,
				tables: false,
				breaks: false,
				sanitize: options.sanitize,
				smartypants: options.smartypants
			};
		}
	}

	function toHtmlWith(options, rawMarkdown)
	{
		return new MarkdownWidget(options, rawMarkdown);
	}

	function MarkdownWidget(options, rawMarkdown)
	{
		this.options = options;
		this.markdown = rawMarkdown;
	}

	MarkdownWidget.prototype.type = "Widget";

	MarkdownWidget.prototype.init = function init()
	{
		var html = marked(this.markdown, formatOptions(this.options));
		var div = document.createElement('div');
		div.innerHTML = html;
		return div;
	};

	MarkdownWidget.prototype.update = function update(previous, node)
	{
		if (this.markdown !== previous.markdown || this.options != previous.options)
		{
			var html = marked(this.markdown, formatOptions(this.options));
			node.innerHTML = html;
		}
		return node;
	};


	function toElementWith(options, rawMarkdown)
	{
		return Element.markdown(marked(rawMarkdown, formatOptions(options)));
	}

	return Elm.Native.Markdown.values = {
		toHtmlWith: F2(toHtmlWith),
		toElementWith: F2(toElementWith)
	};
};
Elm.Native = Elm.Native || {};
Elm.Native.Mouse = {};
Elm.Native.Mouse.make = function(localRuntime) {

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Mouse = localRuntime.Native.Mouse || {};
	if (localRuntime.Native.Mouse.values)
	{
		return localRuntime.Native.Mouse.values;
	}

	var NS = Elm.Native.Signal.make(localRuntime);
	var Utils = Elm.Native.Utils.make(localRuntime);

	var position = NS.input('Mouse.position', Utils.Tuple2(0,0));

	var isDown = NS.input('Mouse.isDown', false);

	var clicks = NS.input('Mouse.clicks', Utils.Tuple0);

	var node = localRuntime.isFullscreen()
		? document
		: localRuntime.node;

	localRuntime.addListener([clicks.id], node, 'click', function click() {
		localRuntime.notify(clicks.id, Utils.Tuple0);
	});
	localRuntime.addListener([isDown.id], node, 'mousedown', function down() {
		localRuntime.notify(isDown.id, true);
	});
	localRuntime.addListener([isDown.id], node, 'mouseup', function up() {
		localRuntime.notify(isDown.id, false);
	});
	localRuntime.addListener([position.id], node, 'mousemove', function move(e) {
		localRuntime.notify(position.id, Utils.getXY(e));
	});

	return localRuntime.Native.Mouse.values = {
		position: position,
		isDown: isDown,
		clicks: clicks
	};
};

Elm.Native.Port = {};
Elm.Native.Port.make = function(localRuntime) {

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Port = localRuntime.Native.Port || {};
	if (localRuntime.Native.Port.values)
	{
		return localRuntime.Native.Port.values;
	}

	var NS;
	var Utils = Elm.Native.Utils.make(localRuntime);


	// INBOUND

	function inbound(name, type, converter)
	{
		if (!localRuntime.argsTracker[name])
		{
			throw new Error(
				"Port Error:\n" +
				"No argument was given for the port named '" + name + "' with type:\n\n" +
				"    " + type.split('\n').join('\n        ') + "\n\n" +
				"You need to provide an initial value!\n\n" +
				"Find out more about ports here <http://elm-lang.org/learn/Ports.elm>"
			);
		}
		var arg = localRuntime.argsTracker[name];
		arg.used = true;

		return jsToElm(name, type, converter, arg.value);
	}


	function inboundSignal(name, type, converter)
	{
		var initialValue = inbound(name, type, converter);

		if (!NS)
		{
			NS = Elm.Native.Signal.make(localRuntime);
		}
		var signal = NS.input('inbound-port-' + name, initialValue);

		function send(jsValue)
		{
			var elmValue = jsToElm(name, type, converter, jsValue);
			setTimeout(function() {
				localRuntime.notify(signal.id, elmValue);
			}, 0);
		}

		localRuntime.ports[name] = { send: send };

		return signal;
	}


	function jsToElm(name, type, converter, value)
	{
		try
		{
			return converter(value);
		}
		catch(e)
		{
			throw new Error(
				"Port Error:\n" +
				"Regarding the port named '" + name + "' with type:\n\n" +
				"    " + type.split('\n').join('\n        ') + "\n\n" +
				"You just sent the value:\n\n" +
				"    " + JSON.stringify(value) + "\n\n" +
				"but it cannot be converted to the necessary type.\n" +
				e.message
			);
		}
	}


	// OUTBOUND

	function outbound(name, converter, elmValue)
	{
		localRuntime.ports[name] = converter(elmValue);
	}


	function outboundSignal(name, converter, signal)
	{
		var subscribers = [];

		function subscribe(handler)
		{
			subscribers.push(handler);
		}
		function unsubscribe(handler)
		{
			subscribers.pop(subscribers.indexOf(handler));
		}

		function notify(elmValue)
		{
			var jsValue = converter(elmValue);
			var len = subscribers.length;
			for (var i = 0; i < len; ++i)
			{
				subscribers[i](jsValue);
			}
		}

		if (!NS)
		{
			NS = Elm.Native.Signal.make(localRuntime);
		}
		NS.output('outbound-port-' + name, notify, signal);

		localRuntime.ports[name] = {
			subscribe: subscribe,
			unsubscribe: unsubscribe
		};

		return signal;
	}


	return localRuntime.Native.Port.values = {
		inbound: inbound,
		outbound: outbound,
		inboundSignal: inboundSignal,
		outboundSignal: outboundSignal
	};
};

Elm.Native.Regex = {};
Elm.Native.Regex.make = function(localRuntime) {
	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Regex = localRuntime.Native.Regex || {};
	if (localRuntime.Native.Regex.values)
	{
		return localRuntime.Native.Regex.values;
	}
	if ('values' in Elm.Native.Regex)
	{
		return localRuntime.Native.Regex.values = Elm.Native.Regex.values;
	}

	var List = Elm.Native.List.make(localRuntime);
	var Maybe = Elm.Maybe.make(localRuntime);

	function escape(str)
	{
		return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}
	function caseInsensitive(re)
	{
		return new RegExp(re.source, 'gi');
	}
	function regex(raw)
	{
		return new RegExp(raw, 'g');
	}

	function contains(re, string)
	{
		return string.match(re) !== null;
	}

	function find(n, re, str)
	{
		n = n.ctor === "All" ? Infinity : n._0;
		var out = [];
		var number = 0;
		var string = str;
		var lastIndex = re.lastIndex;
		var prevLastIndex = -1;
		var result;
		while (number++ < n && (result = re.exec(string)))
		{
			if (prevLastIndex === re.lastIndex) break;
			var i = result.length - 1;
			var subs = new Array(i);
			while (i > 0)
			{
				var submatch = result[i];
				subs[--i] = submatch === undefined
					? Maybe.Nothing
					: Maybe.Just(submatch);
			}
			out.push({
				_:{},
				match: result[0],
				submatches: List.fromArray(subs),
				index: result.index,
				number: number
			});
			prevLastIndex = re.lastIndex;
		}
		re.lastIndex = lastIndex;
		return List.fromArray(out);
	}

	function replace(n, re, replacer, string)
	{
		n = n.ctor === "All" ? Infinity : n._0;
		var count = 0;
		function jsReplacer(match)
		{
			if (count++ > n)
			{
				return match;
			}
			var i = arguments.length-3;
			var submatches = new Array(i);
			while (i > 0)
			{
				var submatch = arguments[i];
				submatches[--i] = submatch === undefined
					? Maybe.Nothing
					: Maybe.Just(submatch);
			}
			return replacer({
				_:{},
				match:match,
				submatches:List.fromArray(submatches),
				index:arguments[i-1],
				number:count
			});
		}
		return string.replace(re, jsReplacer);
	}

	function split(n, re, str)
	{
		n = n.ctor === "All" ? Infinity : n._0;
		if (n === Infinity)
		{
			return List.fromArray(str.split(re));
		}
		var string = str;
		var result;
		var out = [];
		var start = re.lastIndex;
		while (n--)
		{
			if (!(result = re.exec(string))) break;
			out.push(string.slice(start, result.index));
			start = re.lastIndex;
		}
		out.push(string.slice(start));
		return List.fromArray(out);
	}

	return Elm.Native.Regex.values = {
		regex: regex,
		caseInsensitive: caseInsensitive,
		escape: escape,

		contains: F2(contains),
		find: F3(find),
		replace: F4(replace),
		split: F3(split)
	};
};


if (!Elm.fullscreen) {

	(function() {
		'use strict';

		var Display = {
			FULLSCREEN: 0,
			COMPONENT: 1,
			NONE: 2
		};

		Elm.fullscreen = function(module, args)
		{
			var container = document.createElement('div');
			document.body.appendChild(container);
			return init(Display.FULLSCREEN, container, module, args || {});
		};

		Elm.embed = function(module, container, args)
		{
			var tag = container.tagName;
			if (tag !== 'DIV')
			{
				throw new Error('Elm.node must be given a DIV, not a ' + tag + '.');
			}
			return init(Display.COMPONENT, container, module, args || {});
		};

		Elm.worker = function(module, args)
		{
			return init(Display.NONE, {}, module, args || {});
		};

		function init(display, container, module, args, moduleToReplace)
		{
			// defining state needed for an instance of the Elm RTS
			var inputs = [];

			/* OFFSET
			 * Elm's time traveling debugger lets you pause time. This means
			 * "now" may be shifted a bit into the past. By wrapping Date.now()
			 * we can manage this.
			 */
			var timer = {
				programStart: Date.now(),
				now: function()
				{
					return Date.now();
				}
			};

			var updateInProgress = false;
			function notify(id, v)
			{
				if (updateInProgress)
				{
					throw new Error(
						'The notify function has been called synchronously!\n' +
						'This can lead to frames being dropped.\n' +
						'Definitely report this to <https://github.com/elm-lang/Elm/issues>\n');
				}
				updateInProgress = true;
				var timestep = timer.now();
				for (var i = inputs.length; i--; )
				{
					inputs[i].notify(timestep, id, v);
				}
				updateInProgress = false;
			}
			function setTimeout(func, delay)
			{
				return window.setTimeout(func, delay);
			}

			var listeners = [];
			function addListener(relevantInputs, domNode, eventName, func)
			{
				domNode.addEventListener(eventName, func);
				var listener = {
					relevantInputs: relevantInputs,
					domNode: domNode,
					eventName: eventName,
					func: func
				};
				listeners.push(listener);
			}

			var argsTracker = {};
			for (var name in args)
			{
				argsTracker[name] = {
					value: args[name],
					used: false
				};
			}

			// create the actual RTS. Any impure modules will attach themselves to this
			// object. This permits many Elm programs to be embedded per document.
			var elm = {
				notify: notify,
				setTimeout: setTimeout,
				node: container,
				addListener: addListener,
				inputs: inputs,
				timer: timer,
				argsTracker: argsTracker,
				ports: {},

				isFullscreen: function() { return display === Display.FULLSCREEN; },
				isEmbed: function() { return display === Display.COMPONENT; },
				isWorker: function() { return display === Display.NONE; }
			};

			function swap(newModule)
			{
				removeListeners(listeners);
				var div = document.createElement('div');
				var newElm = init(display, div, newModule, args, elm);
				inputs = [];
				// elm.swap = newElm.swap;
				return newElm;
			}

			function dispose()
			{
				removeListeners(listeners);
				inputs = [];
			}

			var Module = {};
			try
			{
				Module = module.make(elm);
				checkInputs(elm);
			}
			catch (error)
			{
				if (typeof container.appendChild == 'undefined')
				{
					console.log(error.message);
				}
				else
				{
					container.appendChild(errorNode(error.message));
				}
				throw error;
			}

			if (display !== Display.NONE)
			{
				var graphicsNode = initGraphics(elm, Module);
			}

			var rootNode = { kids: inputs };
			trimDeadNodes(rootNode);
			inputs = rootNode.kids;
			filterListeners(inputs, listeners);

			addReceivers(elm.ports);

			if (typeof moduleToReplace !== 'undefined')
			{
				hotSwap(moduleToReplace, elm);

				// rerender scene if graphics are enabled.
				if (typeof graphicsNode !== 'undefined')
				{
					graphicsNode.notify(0, true, 0);
				}
			}

			return {
				swap: swap,
				ports: elm.ports,
				dispose: dispose
			};
		};

		function checkInputs(elm)
		{
			var argsTracker = elm.argsTracker;
			for (var name in argsTracker)
			{
				if (!argsTracker[name].used)
				{
					throw new Error(
						"Port Error:\nYou provided an argument named '" + name +
						"' but there is no corresponding port!\n\n" +
						"Maybe add a port '" + name + "' to your Elm module?\n" +
						"Maybe remove the '" + name + "' argument from your initialization code in JS?"
					);
				}
			}
		}

		function errorNode(message)
		{
			var code = document.createElement('code');

			var lines = message.split('\n');
			code.appendChild(document.createTextNode(lines[0]));
			code.appendChild(document.createElement('br'));
			code.appendChild(document.createElement('br'));
			for (var i = 1; i < lines.length; ++i)
			{
				code.appendChild(document.createTextNode('\u00A0 \u00A0 ' + lines[i].replace(/  /g, '\u00A0 ')));
				code.appendChild(document.createElement('br'));
			}
			code.appendChild(document.createElement('br'));
			code.appendChild(document.createTextNode("Open the developer console for more details."));
			return code;
		}


		//// FILTER SIGNALS ////

		// TODO: move this code into the signal module and create a function
		// Signal.initializeGraph that actually instantiates everything.

		function filterListeners(inputs, listeners)
		{
			loop:
			for (var i = listeners.length; i--; )
			{
				var listener = listeners[i];
				for (var j = inputs.length; j--; )
				{
					if (listener.relevantInputs.indexOf(inputs[j].id) >= 0)
					{
						continue loop;
					}
				}
				listener.domNode.removeEventListener(listener.eventName, listener.func);
			}
		}

		function removeListeners(listeners)
		{
			for (var i = listeners.length; i--; )
			{
				var listener = listeners[i];
				listener.domNode.removeEventListener(listener.eventName, listener.func);
			}
		}

		// add receivers for built-in ports if they are defined
		function addReceivers(ports)
		{
			if ('title' in ports)
			{
				if (typeof ports.title === 'string')
				{
					document.title = ports.title;
				}
				else
				{
					ports.title.subscribe(function(v) { document.title = v; });
				}
			}
			if ('redirect' in ports)
			{
				ports.redirect.subscribe(function(v) {
					if (v.length > 0)
					{
						window.location = v;
					}
				});
			}
		}


		// returns a boolean representing whether the node is alive or not.
		function trimDeadNodes(node)
		{
			if (node.isOutput)
			{
				return true;
			}

			var liveKids = [];
			for (var i = node.kids.length; i--; )
			{
				var kid = node.kids[i];
				if (trimDeadNodes(kid))
				{
					liveKids.push(kid);
				}
			}
			node.kids = liveKids;

			return liveKids.length > 0;
		}


		////  RENDERING  ////

		function initGraphics(elm, Module)
		{
			if (!('main' in Module))
			{
				throw new Error("'main' is missing! What do I display?!");
			}

			var signalGraph = Module.main;

			// make sure the signal graph is actually a signal & extract the visual model
			if (!('notify' in signalGraph))
			{
				signalGraph = Elm.Signal.make(elm).constant(signalGraph);
			}
			var initialScene = signalGraph.value;

			// Figure out what the render functions should be
			var render;
			var update;
			if (initialScene.props)
			{
				var Element = Elm.Native.Graphics.Element.make(elm);
				render = Element.render;
				update = Element.updateAndReplace;
			}
			else
			{
				var VirtualDom = Elm.Native.VirtualDom.make(elm);
				render = VirtualDom.render;
				update = VirtualDom.updateAndReplace;
			}

			// Add the initialScene to the DOM
			var container = elm.node;
			var node = render(initialScene);
			while (container.firstChild)
			{
				container.removeChild(container.firstChild);
			}
			container.appendChild(node);

			var _requestAnimationFrame =
				typeof requestAnimationFrame !== 'undefined'
					? requestAnimationFrame
					: function(cb) { setTimeout(cb, 1000/60); }
					;

			// domUpdate is called whenever the main Signal changes.
			//
			// domUpdate and drawCallback implement a small state machine in order
			// to schedule only 1 draw per animation frame. This enforces that
			// once draw has been called, it will not be called again until the
			// next frame.
			//
			// drawCallback is scheduled whenever
			// 1. The state transitions from PENDING_REQUEST to EXTRA_REQUEST, or
			// 2. The state transitions from NO_REQUEST to PENDING_REQUEST
			//
			// Invariants:
			// 1. In the NO_REQUEST state, there is never a scheduled drawCallback.
			// 2. In the PENDING_REQUEST and EXTRA_REQUEST states, there is always exactly 1
			//    scheduled drawCallback.
			var NO_REQUEST = 0;
			var PENDING_REQUEST = 1;
			var EXTRA_REQUEST = 2;
			var state = NO_REQUEST;
			var savedScene = initialScene;
			var scheduledScene = initialScene;

			function domUpdate(newScene)
			{
				scheduledScene = newScene;

				switch (state)
				{
					case NO_REQUEST:
						_requestAnimationFrame(drawCallback);
						state = PENDING_REQUEST;
						return;
					case PENDING_REQUEST:
						state = PENDING_REQUEST;
						return;
					case EXTRA_REQUEST:
						state = PENDING_REQUEST;
						return;
				}
			}

			function drawCallback()
			{
				switch (state)
				{
					case NO_REQUEST:
						// This state should not be possible. How can there be no
						// request, yet somehow we are actively fulfilling a
						// request?
						throw new Error(
							"Unexpected draw callback.\n" +
							"Please report this to <https://github.com/elm-lang/core/issues>."
						);

					case PENDING_REQUEST:
						// At this point, we do not *know* that another frame is
						// needed, but we make an extra request to rAF just in
						// case. It's possible to drop a frame if rAF is called
						// too late, so we just do it preemptively.
						_requestAnimationFrame(drawCallback);
						state = EXTRA_REQUEST;

						// There's also stuff we definitely need to draw.
						draw();
						return;

					case EXTRA_REQUEST:
						// Turns out the extra request was not needed, so we will
						// stop calling rAF. No reason to call it all the time if
						// no one needs it.
						state = NO_REQUEST;
						return;
				}
			}

			function draw()
			{
				update(elm.node.firstChild, savedScene, scheduledScene);
				if (elm.Native.Window)
				{
					elm.Native.Window.values.resizeIfNeeded();
				}
				savedScene = scheduledScene;
			}

			var renderer = Elm.Native.Signal.make(elm).output('main', domUpdate, signalGraph);

			// must check for resize after 'renderer' is created so
			// that changes show up.
			if (elm.Native.Window)
			{
				elm.Native.Window.values.resizeIfNeeded();
			}

			return renderer;
		}

		//// HOT SWAPPING ////

		// Returns boolean indicating if the swap was successful.
		// Requires that the two signal graphs have exactly the same
		// structure.
		function hotSwap(from, to)
		{
			function similar(nodeOld,nodeNew)
			{
				if (nodeOld.id !== nodeNew.id)
				{
					return false;
				}
				if (nodeOld.isOutput)
				{
					return nodeNew.isOutput;
				}
				return nodeOld.kids.length === nodeNew.kids.length;
			}
			function swap(nodeOld,nodeNew)
			{
				nodeNew.value = nodeOld.value;
				return true;
			}
			var canSwap = depthFirstTraversals(similar, from.inputs, to.inputs);
			if (canSwap)
			{
				depthFirstTraversals(swap, from.inputs, to.inputs);
			}
			from.node.parentNode.replaceChild(to.node, from.node);

			return canSwap;
		}

		// Returns false if the node operation f ever fails.
		function depthFirstTraversals(f, queueOld, queueNew)
		{
			if (queueOld.length !== queueNew.length)
			{
				return false;
			}
			queueOld = queueOld.slice(0);
			queueNew = queueNew.slice(0);

			var seen = [];
			while (queueOld.length > 0 && queueNew.length > 0)
			{
				var nodeOld = queueOld.pop();
				var nodeNew = queueNew.pop();
				if (seen.indexOf(nodeOld.id) < 0)
				{
					if (!f(nodeOld, nodeNew))
					{
						return false;
					}
					queueOld = queueOld.concat(nodeOld.kids || []);
					queueNew = queueNew.concat(nodeNew.kids || []);
					seen.push(nodeOld.id);
				}
			}
			return true;
		}
	}());

	function F2(fun)
	{
		function wrapper(a) { return function(b) { return fun(a,b) } }
		wrapper.arity = 2;
		wrapper.func = fun;
		return wrapper;
	}

	function F3(fun)
	{
		function wrapper(a) {
			return function(b) { return function(c) { return fun(a,b,c) }}
		}
		wrapper.arity = 3;
		wrapper.func = fun;
		return wrapper;
	}

	function F4(fun)
	{
		function wrapper(a) { return function(b) { return function(c) {
			return function(d) { return fun(a,b,c,d) }}}
		}
		wrapper.arity = 4;
		wrapper.func = fun;
		return wrapper;
	}

	function F5(fun)
	{
		function wrapper(a) { return function(b) { return function(c) {
			return function(d) { return function(e) { return fun(a,b,c,d,e) }}}}
		}
		wrapper.arity = 5;
		wrapper.func = fun;
		return wrapper;
	}

	function F6(fun)
	{
		function wrapper(a) { return function(b) { return function(c) {
			return function(d) { return function(e) { return function(f) {
			return fun(a,b,c,d,e,f) }}}}}
		}
		wrapper.arity = 6;
		wrapper.func = fun;
		return wrapper;
	}

	function F7(fun)
	{
		function wrapper(a) { return function(b) { return function(c) {
			return function(d) { return function(e) { return function(f) {
			return function(g) { return fun(a,b,c,d,e,f,g) }}}}}}
		}
		wrapper.arity = 7;
		wrapper.func = fun;
		return wrapper;
	}

	function F8(fun)
	{
		function wrapper(a) { return function(b) { return function(c) {
			return function(d) { return function(e) { return function(f) {
			return function(g) { return function(h) {
			return fun(a,b,c,d,e,f,g,h)}}}}}}}
		}
		wrapper.arity = 8;
		wrapper.func = fun;
		return wrapper;
	}

	function F9(fun)
	{
		function wrapper(a) { return function(b) { return function(c) {
			return function(d) { return function(e) { return function(f) {
			return function(g) { return function(h) { return function(i) {
			return fun(a,b,c,d,e,f,g,h,i) }}}}}}}}
		}
		wrapper.arity = 9;
		wrapper.func = fun;
		return wrapper;
	}

	function A2(fun,a,b)
	{
		return fun.arity === 2
			? fun.func(a,b)
			: fun(a)(b);
	}
	function A3(fun,a,b,c)
	{
		return fun.arity === 3
			? fun.func(a,b,c)
			: fun(a)(b)(c);
	}
	function A4(fun,a,b,c,d)
	{
		return fun.arity === 4
			? fun.func(a,b,c,d)
			: fun(a)(b)(c)(d);
	}
	function A5(fun,a,b,c,d,e)
	{
		return fun.arity === 5
			? fun.func(a,b,c,d,e)
			: fun(a)(b)(c)(d)(e);
	}
	function A6(fun,a,b,c,d,e,f)
	{
		return fun.arity === 6
			? fun.func(a,b,c,d,e,f)
			: fun(a)(b)(c)(d)(e)(f);
	}
	function A7(fun,a,b,c,d,e,f,g)
	{
		return fun.arity === 7
			? fun.func(a,b,c,d,e,f,g)
			: fun(a)(b)(c)(d)(e)(f)(g);
	}
	function A8(fun,a,b,c,d,e,f,g,h)
	{
		return fun.arity === 8
			? fun.func(a,b,c,d,e,f,g,h)
			: fun(a)(b)(c)(d)(e)(f)(g)(h);
	}
	function A9(fun,a,b,c,d,e,f,g,h,i)
	{
		return fun.arity === 9
			? fun.func(a,b,c,d,e,f,g,h,i)
			: fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
	}
}

Elm.Native.Show = {};
Elm.Native.Show.make = function(localRuntime) {
	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Show = localRuntime.Native.Show || {};
	if (localRuntime.Native.Show.values)
	{
		return localRuntime.Native.Show.values;
	}

	var _Array;
	var Dict;
	var List;
	var Utils = Elm.Native.Utils.make(localRuntime);

	var toString = function(v)
	{
		var type = typeof v;
		if (type === "function")
		{
			var name = v.func ? v.func.name : v.name;
			return '<function' + (name === '' ? '' : ': ') + name + '>';
		}
		else if (type === "boolean")
		{
			return v ? "True" : "False";
		}
		else if (type === "number")
		{
			return v + "";
		}
		else if ((v instanceof String) && v.isChar)
		{
			return "'" + addSlashes(v, true) + "'";
		}
		else if (type === "string")
		{
			return '"' + addSlashes(v, false) + '"';
		}
		else if (type === "object" && '_' in v && probablyPublic(v))
		{
			var output = [];
			for (var k in v._)
			{
				for (var i = v._[k].length; i--; )
				{
					output.push(k + " = " + toString(v._[k][i]));
				}
			}
			for (var k in v)
			{
				if (k === '_') continue;
				output.push(k + " = " + toString(v[k]));
			}
			if (output.length === 0)
			{
				return "{}";
			}
			return "{ " + output.join(", ") + " }";
		}
		else if (type === "object" && 'ctor' in v)
		{
			if (v.ctor.substring(0,6) === "_Tuple")
			{
				var output = [];
				for (var k in v)
				{
					if (k === 'ctor') continue;
					output.push(toString(v[k]));
				}
				return "(" + output.join(",") + ")";
			}
			else if (v.ctor === "_Array")
			{
				if (!_Array)
				{
					_Array = Elm.Array.make(localRuntime);
				}
				var list = _Array.toList(v);
				return "Array.fromList " + toString(list);
			}
			else if (v.ctor === "::")
			{
				var output = '[' + toString(v._0);
				v = v._1;
				while (v.ctor === "::")
				{
					output += "," + toString(v._0);
					v = v._1;
				}
				return output + ']';
			}
			else if (v.ctor === "[]")
			{
				return "[]";
			}
			else if (v.ctor === "RBNode" || v.ctor === "RBEmpty")
			{
				if (!Dict)
				{
					Dict = Elm.Dict.make(localRuntime);
				}
				if (!List)
				{
					List = Elm.List.make(localRuntime);
				}
				var list = Dict.toList(v);
				var name = "Dict";
				if (list.ctor === "::" && list._0._1.ctor === "_Tuple0")
				{
					name = "Set";
					list = A2(List.map, function(x){return x._0}, list);
				}
				return name + ".fromList " + toString(list);
			}
			else if (v.ctor.slice(0,5) === "Text:")
			{
				return '<text>'
			}
			else
			{
				var output = "";
				for (var i in v)
				{
					if (i === 'ctor') continue;
					var str = toString(v[i]);
					var parenless = str[0] === '{' || str[0] === '<' || str.indexOf(' ') < 0;
					output += ' ' + (parenless ? str : '(' + str + ')');
				}
				return v.ctor + output;
			}
		}
		if (type === 'object' && 'notify' in v && 'id' in v)
		{
			return '<Signal>';
		}
		return "<internal structure>";
	};

	function addSlashes(str, isChar)
	{
		var s = str.replace(/\\/g, '\\\\')
				  .replace(/\n/g, '\\n')
				  .replace(/\t/g, '\\t')
				  .replace(/\r/g, '\\r')
				  .replace(/\v/g, '\\v')
				  .replace(/\0/g, '\\0');
		if (isChar)
		{
			return s.replace(/\'/g, "\\'")
		}
		else
		{
			return s.replace(/\"/g, '\\"');
		}
	}

	function probablyPublic(v)
	{
		var keys = Object.keys(v);
		var len = keys.length;
		if (len === 3
			&& 'props' in v
			&& 'element' in v)
		{
			return false;
		}
		else if (len === 5
			&& 'horizontal' in v
			&& 'vertical' in v
			&& 'x' in v
			&& 'y' in v)
		{
			return false;
		}
		else if (len === 7
			&& 'theta' in v
			&& 'scale' in v
			&& 'x' in v
			&& 'y' in v
			&& 'alpha' in v
			&& 'form' in v)
		{
			return false;
		}
		return true;
	}

	return localRuntime.Native.Show.values = {
		toString: toString
	};
};

Elm.Native.Signal = {};
Elm.Native.Signal.make = function(localRuntime) {

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Signal = localRuntime.Native.Signal || {};
	if (localRuntime.Native.Signal.values)
	{
		return localRuntime.Native.Signal.values;
	}


	var Task = Elm.Native.Task.make(localRuntime);
	var Utils = Elm.Native.Utils.make(localRuntime);


	function broadcastToKids(node, timestamp, update)
	{
		var kids = node.kids;
		for (var i = kids.length; i--; )
		{
			kids[i].notify(timestamp, update, node.id);
		}
	}


	// INPUT

	function input(name, base)
	{
		var node = {
			id: Utils.guid(),
			name: 'input-' + name,
			value: base,
			parents: [],
			kids: []
		};

		node.notify = function(timestamp, targetId, value) {
			var update = targetId === node.id;
			if (update)
			{
				node.value = value;
			}
			broadcastToKids(node, timestamp, update);
			return update;
		};

		localRuntime.inputs.push(node);

		return node;
	}

	function constant(value)
	{
		return input('constant', value);
	}


	// MAILBOX

	function mailbox(base)
	{
		var signal = input('mailbox', base);

		function send(value) {
			return Task.asyncFunction(function(callback) {
				localRuntime.setTimeout(function() {
					localRuntime.notify(signal.id, value);
				}, 0);
				callback(Task.succeed(Utils.Tuple0));
			});
		}

		return {
			_: {},
			signal: signal,
			address: {
				ctor: 'Address',
				_0: send
			}
		};
	}

	function sendMessage(message)
	{
		Task.perform(message._0);
	}


	// OUTPUT

	function output(name, handler, parent)
	{
		var node = {
			id: Utils.guid(),
			name: 'output-' + name,
			parents: [parent],
			isOutput: true
		};

		node.notify = function(timestamp, parentUpdate, parentID)
		{
			if (parentUpdate)
			{
				handler(parent.value);
			}
		};

		parent.kids.push(node);

		return node;
	}


	// MAP

	function mapMany(refreshValue, args)
	{
		var node = {
			id: Utils.guid(),
			name: 'map' + args.length,
			value: refreshValue(),
			parents: args,
			kids: []
		};

		var numberOfParents = args.length;
		var count = 0;
		var update = false;

		node.notify = function(timestamp, parentUpdate, parentID)
		{
			++count;

			update = update || parentUpdate;

			if (count === numberOfParents)
			{
				if (update)
				{
					node.value = refreshValue();
				}
				broadcastToKids(node, timestamp, update);
				update = false;
				count = 0;
			}
		};

		for (var i = numberOfParents; i--; )
		{
			args[i].kids.push(node);
		}

		return node;
	}


	function map(func, a)
	{
		function refreshValue()
		{
			return func(a.value);
		}
		return mapMany(refreshValue, [a]);
	}


	function map2(func, a, b)
	{
		function refreshValue()
		{
			return A2( func, a.value, b.value );
		}
		return mapMany(refreshValue, [a,b]);
	}


	function map3(func, a, b, c)
	{
		function refreshValue()
		{
			return A3( func, a.value, b.value, c.value );
		}
		return mapMany(refreshValue, [a,b,c]);
	}


	function map4(func, a, b, c, d)
	{
		function refreshValue()
		{
			return A4( func, a.value, b.value, c.value, d.value );
		}
		return mapMany(refreshValue, [a,b,c,d]);
	}


	function map5(func, a, b, c, d, e)
	{
		function refreshValue()
		{
			return A5( func, a.value, b.value, c.value, d.value, e.value );
		}
		return mapMany(refreshValue, [a,b,c,d,e]);
	}



	// FOLD

	function foldp(update, state, signal)
	{
		var node = {
			id: Utils.guid(),
			name: 'foldp',
			parents: [signal],
			kids: [],
			value: state
		};

		node.notify = function(timestamp, parentUpdate, parentID)
		{
			if (parentUpdate)
			{
				node.value = A2( update, signal.value, node.value );
			}
			broadcastToKids(node, timestamp, parentUpdate);
		};

		signal.kids.push(node);

		return node;
	}


	// TIME

	function timestamp(signal)
	{
		var node = {
			id: Utils.guid(),
			name: 'timestamp',
			value: Utils.Tuple2(localRuntime.timer.programStart, signal.value),
			parents: [signal],
			kids: []
		};

		node.notify = function(timestamp, parentUpdate, parentID)
		{
			if (parentUpdate)
			{
				node.value = Utils.Tuple2(timestamp, signal.value);
			}
			broadcastToKids(node, timestamp, parentUpdate);
		};

		signal.kids.push(node);

		return node;
	}


	function delay(time, signal)
	{
		var delayed = input('delay-input-' + time, signal.value);

		function handler(value)
		{
			setTimeout(function() {
				localRuntime.notify(delayed.id, value);
			}, time);
		}

		output('delay-output-' + time, handler, signal);

		return delayed;
	}


	// MERGING

	function genericMerge(tieBreaker, leftStream, rightStream)
	{
		var node = {
			id: Utils.guid(),
			name: 'merge',
			value: A2(tieBreaker, leftStream.value, rightStream.value),
			parents: [leftStream, rightStream],
			kids: []
		};

		var left = { touched: false, update: false, value: null };
		var right = { touched: false, update: false, value: null };

		node.notify = function(timestamp, parentUpdate, parentID)
		{
			if (parentID === leftStream.id)
			{
				left.touched = true;
				left.update = parentUpdate;
				left.value = leftStream.value;
			}
			if (parentID === rightStream.id)
			{
				right.touched = true;
				right.update = parentUpdate;
				right.value = rightStream.value;
			}

			if (left.touched && right.touched)
			{
				var update = false;
				if (left.update && right.update)
				{
					node.value = A2(tieBreaker, left.value, right.value);
					update = true;
				}
				else if (left.update)
				{
					node.value = left.value;
					update = true;
				}
				else if (right.update)
				{
					node.value = right.value;
					update = true;
				}
				left.touched = false;
				right.touched = false;

				broadcastToKids(node, timestamp, update);
			}
		};

		leftStream.kids.push(node);
		rightStream.kids.push(node);

		return node;
	}


	// FILTERING

	function filterMap(toMaybe, base, signal)
	{
		var maybe = toMaybe(signal.value);
		var node = {
			id: Utils.guid(),
			name: 'filterMap',
			value: maybe.ctor === 'Nothing' ? base : maybe._0,
			parents: [signal],
			kids: []
		};

		node.notify = function(timestamp, parentUpdate, parentID)
		{
			var update = false;
			if (parentUpdate)
			{
				var maybe = toMaybe(signal.value);
				if (maybe.ctor === 'Just')
				{
					update = true;
					node.value = maybe._0;
				}
			}
			broadcastToKids(node, timestamp, update);
		};

		signal.kids.push(node);

		return node;
	}


	// SAMPLING

	function sampleOn(ticker, signal)
	{
		var node = {
			id: Utils.guid(),
			name: 'sampleOn',
			value: signal.value,
			parents: [ticker, signal],
			kids: []
		};

		var signalTouch = false;
		var tickerTouch = false;
		var tickerUpdate = false;

		node.notify = function(timestamp, parentUpdate, parentID)
		{
			if (parentID === ticker.id)
			{
				tickerTouch = true;
				tickerUpdate = parentUpdate;
			}
			if (parentID === signal.id)
			{
				signalTouch = true;
			}

			if (tickerTouch && signalTouch)
			{
				if (tickerUpdate)
				{
					node.value = signal.value;
				}
				tickerTouch = false;
				signalTouch = false;

				broadcastToKids(node, timestamp, tickerUpdate);
			}
		};

		ticker.kids.push(node);
		signal.kids.push(node);

		return node;
	}


	// DROP REPEATS

	function dropRepeats(signal)
	{
		var node = {
			id: Utils.guid(),
			name: 'dropRepeats',
			value: signal.value,
			parents: [signal],
			kids: []
		};

		node.notify = function(timestamp, parentUpdate, parentID)
		{
			var update = false;
			if (parentUpdate && !Utils.eq(node.value, signal.value))
			{
				node.value = signal.value;
				update = true;
			}
			broadcastToKids(node, timestamp, update);
		};

		signal.kids.push(node);

		return node;
	}


	return localRuntime.Native.Signal.values = {
		input: input,
		constant: constant,
		mailbox: mailbox,
		sendMessage: sendMessage,
		output: output,
		map: F2(map),
		map2: F3(map2),
		map3: F4(map3),
		map4: F5(map4),
		map5: F6(map5),
		foldp: F3(foldp),
		genericMerge: F3(genericMerge),
		filterMap: F3(filterMap),
		sampleOn: F2(sampleOn),
		dropRepeats: dropRepeats,
		timestamp: timestamp,
		delay: F2(delay)
	};
};

Elm.Native.String = {};
Elm.Native.String.make = function(localRuntime) {

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.String = localRuntime.Native.String || {};
	if (localRuntime.Native.String.values)
	{
		return localRuntime.Native.String.values;
	}
	if ('values' in Elm.Native.String)
	{
		return localRuntime.Native.String.values = Elm.Native.String.values;
	}


	var Char = Elm.Char.make(localRuntime);
	var List = Elm.Native.List.make(localRuntime);
	var Maybe = Elm.Maybe.make(localRuntime);
	var Result = Elm.Result.make(localRuntime);
	var Utils = Elm.Native.Utils.make(localRuntime);

	function isEmpty(str)
	{
		return str.length === 0;
	}
	function cons(chr,str)
	{
		return chr + str;
	}
	function uncons(str)
	{
		var hd;
		return (hd = str[0])
			? Maybe.Just(Utils.Tuple2(Utils.chr(hd), str.slice(1)))
			: Maybe.Nothing;
	}
	function append(a,b)
	{
		return a + b;
	}
	function concat(strs)
	{
		return List.toArray(strs).join('');
	}
	function length(str)
	{
		return str.length;
	}
	function map(f,str)
	{
		var out = str.split('');
		for (var i = out.length; i--; )
		{
			out[i] = f(Utils.chr(out[i]));
		}
		return out.join('');
	}
	function filter(pred,str)
	{
		return str.split('').map(Utils.chr).filter(pred).join('');
	}
	function reverse(str)
	{
		return str.split('').reverse().join('');
	}
	function foldl(f,b,str)
	{
		var len = str.length;
		for (var i = 0; i < len; ++i)
		{
			b = A2(f, Utils.chr(str[i]), b);
		}
		return b;
	}
	function foldr(f,b,str)
	{
		for (var i = str.length; i--; )
		{
			b = A2(f, Utils.chr(str[i]), b);
		}
		return b;
	}

	function split(sep, str)
	{
		return List.fromArray(str.split(sep));
	}
	function join(sep, strs)
	{
		return List.toArray(strs).join(sep);
	}
	function repeat(n, str)
	{
		var result = '';
		while (n > 0)
		{
			if (n & 1)
			{
				result += str;
			}
			n >>= 1, str += str;
		}
		return result;
	}

	function slice(start, end, str)
	{
		return str.slice(start,end);
	}
	function left(n, str)
	{
		return n < 1 ? "" : str.slice(0,n);
	}
	function right(n, str)
	{
		return n < 1 ? "" : str.slice(-n);
	}
	function dropLeft(n, str)
	{
		return n < 1 ? str : str.slice(n);
	}
	function dropRight(n, str)
	{
		return n < 1 ? str : str.slice(0,-n);
	}

	function pad(n,chr,str)
	{
		var half = (n - str.length) / 2;
		return repeat(Math.ceil(half),chr) + str + repeat(half|0,chr);
	}
	function padRight(n,chr,str)
	{
		return str + repeat(n - str.length, chr);
	}
	function padLeft(n,chr,str)
	{
		return repeat(n - str.length, chr) + str;
	}

	function trim(str)
	{
		return str.trim();
	}
	function trimLeft(str)
	{
		return str.trimLeft();
	}
	function trimRight(str)
	{
		return str.trimRight();
	}

	function words(str)
	{
		return List.fromArray(str.trim().split(/\s+/g));
	}
	function lines(str)
	{
		return List.fromArray(str.split(/\r\n|\r|\n/g));
	}

	function toUpper(str)
	{
		return str.toUpperCase();
	}
	function toLower(str)
	{
		return str.toLowerCase();
	}

	function any(pred, str)
	{
		for (var i = str.length; i--; )
		{
			if (pred(Utils.chr(str[i])))
			{
				return true;
			}
		}
		return false;
	}
	function all(pred, str)
	{
		for (var i = str.length; i--; )
		{
			if (!pred(Utils.chr(str[i])))
			{
				return false;
			}
		}
		return true;
	}

	function contains(sub, str)
	{
		return str.indexOf(sub) > -1;
	}
	function startsWith(sub, str)
	{
		return str.indexOf(sub) === 0;
	}
	function endsWith(sub, str)
	{
		return str.length >= sub.length &&
			str.lastIndexOf(sub) === str.length - sub.length;
	}
	function indexes(sub, str)
	{
		var subLen = sub.length;
		var i = 0;
		var is = [];
		while ((i = str.indexOf(sub, i)) > -1)
		{
			is.push(i);
			i = i + subLen;
		}
		return List.fromArray(is);
	}

	function toInt(s)
	{
		var len = s.length;
		if (len === 0)
		{
			return Result.Err("could not convert string '" + s + "' to an Int" );
		}
		var start = 0;
		if (s[0] == '-')
		{
			if (len === 1)
			{
				return Result.Err("could not convert string '" + s + "' to an Int" );
			}
			start = 1;
		}
		for (var i = start; i < len; ++i)
		{
			if (!Char.isDigit(s[i]))
			{
				return Result.Err("could not convert string '" + s + "' to an Int" );
			}
		}
		return Result.Ok(parseInt(s, 10));
	}

	function toFloat(s)
	{
		var len = s.length;
		if (len === 0)
		{
			return Result.Err("could not convert string '" + s + "' to a Float" );
		}
		var start = 0;
		if (s[0] == '-')
		{
			if (len === 1)
			{
				return Result.Err("could not convert string '" + s + "' to a Float" );
			}
			start = 1;
		}
		var dotCount = 0;
		for (var i = start; i < len; ++i)
		{
			if (Char.isDigit(s[i]))
			{
				continue;
			}
			if (s[i] === '.')
			{
				dotCount += 1;
				if (dotCount <= 1)
				{
					continue;
				}
			}
			return Result.Err("could not convert string '" + s + "' to a Float" );
		}
		return Result.Ok(parseFloat(s));
	}

	function toList(str)
	{
		return List.fromArray(str.split('').map(Utils.chr));
	}
	function fromList(chars)
	{
		return List.toArray(chars).join('');
	}

	return Elm.Native.String.values = {
		isEmpty: isEmpty,
		cons: F2(cons),
		uncons: uncons,
		append: F2(append),
		concat: concat,
		length: length,
		map: F2(map),
		filter: F2(filter),
		reverse: reverse,
		foldl: F3(foldl),
		foldr: F3(foldr),

		split: F2(split),
		join: F2(join),
		repeat: F2(repeat),

		slice: F3(slice),
		left: F2(left),
		right: F2(right),
		dropLeft: F2(dropLeft),
		dropRight: F2(dropRight),

		pad: F3(pad),
		padLeft: F3(padLeft),
		padRight: F3(padRight),

		trim: trim,
		trimLeft: trimLeft,
		trimRight: trimRight,

		words: words,
		lines: lines,

		toUpper: toUpper,
		toLower: toLower,

		any: F2(any),
		all: F2(all),

		contains: F2(contains),
		startsWith: F2(startsWith),
		endsWith: F2(endsWith),
		indexes: F2(indexes),

		toInt: toInt,
		toFloat: toFloat,
		toList: toList,
		fromList: fromList
	};
};

Elm.Native.Task = {};
Elm.Native.Task.make = function(localRuntime) {

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Task = localRuntime.Native.Task || {};
	if (localRuntime.Native.Task.values)
	{
		return localRuntime.Native.Task.values;
	}

	var Result = Elm.Result.make(localRuntime);
	var Signal;
	var Utils = Elm.Native.Utils.make(localRuntime);


	// CONSTRUCTORS

	function succeed(value)
	{
		return {
			tag: 'Succeed',
			value: value
		};
	}

	function fail(error)
	{
		return {
			tag: 'Fail',
			value: error
		};
	}

	function asyncFunction(func)
	{
		return {
			tag: 'Async',
			asyncFunction: func
		};
	}

	function andThen(task, callback)
	{
		return {
			tag: 'AndThen',
			task: task,
			callback: callback
		};
	}

	function catch_(task, callback)
	{
		return {
			tag: 'Catch',
			task: task,
			callback: callback
		};
	}


	// RUNNER

	function perform(task) {
		runTask({ task: task }, function() {});
	}

	function performSignal(name, signal)
	{
		var workQueue = [];

		function onComplete()
		{
			workQueue.shift();

			setTimeout(function() {
				if (workQueue.length > 0)
				{
					runTask(workQueue[0], onComplete);
				}
			}, 0);
		}

		function register(task)
		{
			var root = { task: task };
			workQueue.push(root);
			if (workQueue.length === 1)
			{
				runTask(root, onComplete);
			}
		}

		if (!Signal)
		{
			Signal = Elm.Native.Signal.make(localRuntime);
		}
		Signal.output('perform-tasks-' + name, register, signal);

		register(signal.value);

		return signal;
	}

	function mark(status, task)
	{
		return { status: status, task: task };
	}

	function runTask(root, onComplete)
	{
		var result = mark('runnable', root.task);
		while (result.status === 'runnable')
		{
			result = stepTask(onComplete, root, result.task);
		}

		if (result.status === 'done')
		{
			root.task = result.task;
			onComplete();
		}

		if (result.status === 'blocked')
		{
			root.task = result.task;
		}
	}

	function stepTask(onComplete, root, task)
	{
		var tag = task.tag;

		if (tag === 'Succeed' || tag === 'Fail')
		{
			return mark('done', task);
		}

		if (tag === 'Async')
		{
			var placeHolder = {};
			var couldBeSync = true;
			var wasSync = false;

			task.asyncFunction(function(result) {
				placeHolder.tag = result.tag;
				placeHolder.value = result.value;
				if (couldBeSync)
				{
					wasSync = true;
				}
				else
				{
					runTask(root, onComplete);
				}
			});
			couldBeSync = false;
			return mark(wasSync ? 'done' : 'blocked', placeHolder);
		}

		if (tag === 'AndThen' || tag === 'Catch')
		{
			var result = mark('runnable', task.task);
			while (result.status === 'runnable')
			{
				result = stepTask(onComplete, root, result.task);
			}

			if (result.status === 'done')
			{
				var activeTask = result.task;
				var activeTag = activeTask.tag;

				var succeedChain = activeTag === 'Succeed' && tag === 'AndThen';
				var failChain = activeTag === 'Fail' && tag === 'Catch';

				return (succeedChain || failChain)
					? mark('runnable', task.callback(activeTask.value))
					: mark('runnable', activeTask);
			}
			if (result.status === 'blocked')
			{
				return mark('blocked', {
					tag: tag,
					task: result.task,
					callback: task.callback
				});
			}
		}
	}


	// THREADS

	function sleep(time) {
		return asyncFunction(function(callback) {
			setTimeout(function() {
				callback(succeed(Utils.Tuple0));
			}, time);
		});
	}

	function spawn(task) {
		return asyncFunction(function(callback) {
			var id = setTimeout(function() {
				perform(task);
			}, 0);
			callback(succeed(id));
		});
	}


	return localRuntime.Native.Task.values = {
		succeed: succeed,
		fail: fail,
		asyncFunction: asyncFunction,
		andThen: F2(andThen),
		catch_: F2(catch_),
		perform: perform,
		performSignal: performSignal,
		spawn: spawn,
		sleep: sleep
	};
};

Elm.Native.Text = {};
Elm.Native.Text.make = function(localRuntime) {
	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Text = localRuntime.Native.Text || {};
	if (localRuntime.Native.Text.values)
	{
		return localRuntime.Native.Text.values;
	}

	var toCss = Elm.Native.Color.make(localRuntime).toCss;
	var List = Elm.Native.List.make(localRuntime);


	// CONSTRUCTORS

	function fromString(str)
	{
		return {
			ctor: 'Text:Text',
			_0: str
		};
	}

	function append(a, b)
	{
		return {
			ctor: 'Text:Append',
			_0: a,
			_1: b
		};
	}

	function addMeta(field, value, text)
	{
		var newProps = {};
		var newText = {
			ctor: 'Text:Meta',
			_0: newProps,
			_1: text
		};

		if (text.ctor === 'Text:Meta')
		{
			newText._1 = text._1;
			var props = text._0;
			for (var i = metaKeys.length; i--; )
			{
				var key = metaKeys[i];
				var val = props[key];
				if (val)
				{
					newProps[key] = val;
				}
			}
		}
		newProps[field] = value;
		return newText;
	}

	var metaKeys = [
		'font-size',
		'font-family',
		'font-style',
		'font-weight',
		'href',
		'text-decoration',
		'color'
	];


	// conversions from Elm values to CSS

	function toTypefaces(list)
	{
		var typefaces = List.toArray(list);
		for (var i = typefaces.length; i--; )
		{
			var typeface = typefaces[i];
			if (typeface.indexOf(' ') > -1)
			{
				typefaces[i] = "'" + typeface + "'";
			}
		}
		return typefaces.join(',');
	}

	function toLine(line)
	{
		var ctor = line.ctor;
		return ctor === 'Under'
			? 'underline'
			: ctor === 'Over'
				? 'overline'
				: 'line-through';
	}

	// setting styles of Text

	function style(style, text)
	{
		var newText = addMeta('color', toCss(style.color), text);
		var props = newText._0;

		if (style.typeface.ctor !== '[]')
		{
			props['font-family'] = toTypefaces(style.typeface);
		}
		if (style.height.ctor !== "Nothing")
		{
			props['font-size'] = style.height._0 + 'px';
		}
		if (style.bold)
		{
			props['font-weight'] = 'bold';
		}
		if (style.italic)
		{
			props['font-style'] = 'italic';
		}
		if (style.line.ctor !== 'Nothing')
		{
			props['text-decoration'] = toLine(style.line._0);
		}
		return newText;
	}

	function height(px, text)
	{
		return addMeta('font-size', px + 'px', text);
	}

	function typeface(names, text)
	{
		return addMeta('font-family', toTypefaces(names), text);
	}

	function monospace(text)
	{
		return addMeta('font-family', 'monospace', text);
	}

	function italic(text)
	{
		return addMeta('font-style', 'italic', text);
	}

	function bold(text)
	{
		return addMeta('font-weight', 'bold', text);
	}

	function link(href, text)
	{
		return addMeta('href', href, text);
	}

	function line(line, text)
	{
		return addMeta('text-decoration', toLine(line), text);
	}

	function color(color, text)
	{
		return addMeta('color', toCss(color), text);;
	}


	// RENDER

	function renderHtml(text)
	{
		var tag = text.ctor;
		if (tag === 'Text:Append')
		{
			return renderHtml(text._0) + renderHtml(text._1);
		}
		if (tag === 'Text:Text')
		{
			return properEscape(text._0);
		}
		if (tag === 'Text:Meta')
		{
			return renderMeta(text._0, renderHtml(text._1));
		}
	}

	function renderMeta(metas, string)
	{
		var href = metas['href'];
		if (href)
		{
			string = '<a href="' + href + '">' + string + '</a>';
		}
		var styles = '';
		for (var key in metas)
		{
			if (key === 'href')
			{
				continue;
			}
			styles += key + ':' + metas[key] + ';';
		}
		if (styles)
		{
			string = '<span style="' + styles + '">' + string + '</span>';
		}
		return string;
	}

	function properEscape(str)
	{
		if (str.length == 0)
		{
			return str;
		}
		str = str //.replace(/&/g,  "&#38;")
			.replace(/"/g,  '&#34;')
			.replace(/'/g,  "&#39;")
			.replace(/</g,  "&#60;")
			.replace(/>/g,  "&#62;");
		var arr = str.split('\n');
		for (var i = arr.length; i--; )
		{
			arr[i] = makeSpaces(arr[i]);
		}
		return arr.join('<br/>');
	}

	function makeSpaces(s)
	{
		if (s.length == 0)
		{
			return s;
		}
		var arr = s.split('');
		if (arr[0] == ' ')
		{
			arr[0] = "&nbsp;"
		}
		for (var i = arr.length; --i; )
		{
			if (arr[i][0] == ' ' && arr[i-1] == ' ')
			{
				arr[i-1] = arr[i-1] + arr[i];
				arr[i] = '';
			}
		}
		for (var i = arr.length; i--; )
		{
			if (arr[i].length > 1 && arr[i][0] == ' ')
			{
				var spaces = arr[i].split('');
				for (var j = spaces.length - 2; j >= 0; j -= 2)
				{
					spaces[j] = '&nbsp;';
				}
				arr[i] = spaces.join('');
			}
		}
		arr = arr.join('');
		if (arr[arr.length-1] === " ")
		{
			return arr.slice(0,-1) + '&nbsp;';
		}
		return arr;
	}


	return localRuntime.Native.Text.values = {
		fromString: fromString,
		append: F2(append),

		height: F2(height),
		italic: italic,
		bold: bold,
		line: F2(line),
		monospace: monospace,
		typeface: F2(typeface),
		color: F2(color),
		link: F2(link),
		style: F2(style),

		toTypefaces: toTypefaces,
		toLine: toLine,
		renderHtml: renderHtml
	};
};

Elm.Native.Time = {};
Elm.Native.Time.make = function(localRuntime)
{

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Time = localRuntime.Native.Time || {};
	if (localRuntime.Native.Time.values)
	{
		return localRuntime.Native.Time.values;
	}

	var NS = Elm.Native.Signal.make(localRuntime);
	var Maybe = Elm.Maybe.make(localRuntime);


	// FRAMES PER SECOND

	function fpsWhen(desiredFPS, isOn)
	{
		var msPerFrame = 1000 / desiredFPS;
		var ticker = NS.input('fps-' + desiredFPS, null);

		function notifyTicker()
		{
			localRuntime.notify(ticker.id, null);
		}

		function firstArg(x, y)
		{
			return x;
		}

		// input fires either when isOn changes, or when ticker fires.
		// Its value is a tuple with the current timestamp, and the state of isOn
		var input = NS.timestamp(A3(NS.map2, F2(firstArg), NS.dropRepeats(isOn), ticker));

		var initialState = {
			isOn: false,
			time: localRuntime.timer.programStart,
			delta: 0
		};

		var timeoutId;

		function update(input,state)
		{
			var currentTime = input._0;
			var isOn = input._1;
			var wasOn = state.isOn;
			var previousTime = state.time;

			if (isOn)
			{
				timeoutId = localRuntime.setTimeout(notifyTicker, msPerFrame);
			}
			else if (wasOn)
			{
				clearTimeout(timeoutId);
			}

			return {
				isOn: isOn,
				time: currentTime,
				delta: (isOn && !wasOn) ? 0 : currentTime - previousTime
			};
		}

		return A2(
			NS.map,
			function(state) { return state.delta; },
			A3(NS.foldp, F2(update), update(input.value,initialState), input)
		);
	}


	// EVERY

	function every(t)
	{
		var ticker = NS.input('every-' + t, null);
		function tellTime()
		{
			localRuntime.notify(ticker.id, null);
		}
		var clock = A2( NS.map, fst, NS.timestamp(ticker) );
		setInterval(tellTime, t);
		return clock;
	}


	function fst(pair)
	{
		return pair._0;
	}


	function read(s)
	{
		var t = Date.parse(s);
		return isNaN(t) ? Maybe.Nothing : Maybe.Just(t);
	}

	return localRuntime.Native.Time.values = {
		fpsWhen: F2(fpsWhen),
		every: every,
		toDate: function(t) { return new window.Date(t); },
		read: read
	};

};

Elm.Native.Transform2D = {};
Elm.Native.Transform2D.make = function(localRuntime) {

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Transform2D = localRuntime.Native.Transform2D || {};
	if (localRuntime.Native.Transform2D.values)
	{
		return localRuntime.Native.Transform2D.values;
	}

	var A;
	if (typeof Float32Array === 'undefined')
	{
		A = function(arr)
		{
			this.length = arr.length;
			this[0] = arr[0];
			this[1] = arr[1];
			this[2] = arr[2];
			this[3] = arr[3];
			this[4] = arr[4];
			this[5] = arr[5];
		};
	}
	else
	{
		A = Float32Array;
	}

	// layout of matrix in an array is
	//
	//   | m11 m12 dx |
	//   | m21 m22 dy |
	//   |  0   0   1 |
	//
	//  new A([ m11, m12, dx, m21, m22, dy ])

	var identity = new A([1,0,0,0,1,0]);
	function matrix(m11, m12, m21, m22, dx, dy)
	{
		return new A([m11, m12, dx, m21, m22, dy]);
	}

	function rotation(t)
	{
		var c = Math.cos(t);
		var s = Math.sin(t);
		return new A([c, -s, 0, s, c, 0]);
	}

	function rotate(t,m)
	{
		var c = Math.cos(t);
		var s = Math.sin(t);
		var m11 = m[0], m12 = m[1], m21 = m[3], m22 = m[4];
		return new A([m11*c + m12*s, -m11*s + m12*c, m[2],
					  m21*c + m22*s, -m21*s + m22*c, m[5]]);
	}
	/*
	function move(xy,m) {
		var x = xy._0;
		var y = xy._1;
		var m11 = m[0], m12 = m[1], m21 = m[3], m22 = m[4];
		return new A([m11, m12, m11*x + m12*y + m[2],
					  m21, m22, m21*x + m22*y + m[5]]);
	}
	function scale(s,m) { return new A([m[0]*s, m[1]*s, m[2], m[3]*s, m[4]*s, m[5]]); }
	function scaleX(x,m) { return new A([m[0]*x, m[1], m[2], m[3]*x, m[4], m[5]]); }
	function scaleY(y,m) { return new A([m[0], m[1]*y, m[2], m[3], m[4]*y, m[5]]); }
	function reflectX(m) { return new A([-m[0], m[1], m[2], -m[3], m[4], m[5]]); }
	function reflectY(m) { return new A([m[0], -m[1], m[2], m[3], -m[4], m[5]]); }

	function transform(m11, m21, m12, m22, mdx, mdy, n) {
		var n11 = n[0], n12 = n[1], n21 = n[3], n22 = n[4], ndx = n[2], ndy = n[5];
		return new A([m11*n11 + m12*n21,
					  m11*n12 + m12*n22,
					  m11*ndx + m12*ndy + mdx,
					  m21*n11 + m22*n21,
					  m21*n12 + m22*n22,
					  m21*ndx + m22*ndy + mdy]);
	}
	*/
	function multiply(m, n)
	{
		var m11 = m[0], m12 = m[1], m21 = m[3], m22 = m[4], mdx = m[2], mdy = m[5];
		var n11 = n[0], n12 = n[1], n21 = n[3], n22 = n[4], ndx = n[2], ndy = n[5];
		return new A([m11*n11 + m12*n21,
					  m11*n12 + m12*n22,
					  m11*ndx + m12*ndy + mdx,
					  m21*n11 + m22*n21,
					  m21*n12 + m22*n22,
					  m21*ndx + m22*ndy + mdy]);
	}

	return localRuntime.Native.Transform2D.values = {
		identity:identity,
		matrix:F6(matrix),
		rotation:rotation,
		multiply:F2(multiply)
		/*
		transform:F7(transform),
		rotate:F2(rotate),
		move:F2(move),
		scale:F2(scale),
		scaleX:F2(scaleX),
		scaleY:F2(scaleY),
		reflectX:reflectX,
		reflectY:reflectY
		*/
	};

};

Elm.Native = Elm.Native || {};
Elm.Native.Utils = {};
Elm.Native.Utils.make = function(localRuntime) {

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Utils = localRuntime.Native.Utils || {};
	if (localRuntime.Native.Utils.values)
	{
		return localRuntime.Native.Utils.values;
	}

	function eq(l,r)
	{
		var stack = [{'x': l, 'y': r}]
		while (stack.length > 0)
		{
			var front = stack.pop();
			var x = front.x;
			var y = front.y;
			if (x === y)
			{
				continue;
			}
			if (typeof x === "object")
			{
				var c = 0;
				for (var i in x)
				{
					++c;
					if (i in y)
					{
						if (i !== 'ctor')
						{
							stack.push({ 'x': x[i], 'y': y[i] });
						}
					}
					else
					{
						return false;
					}
				}
				if ('ctor' in x)
				{
					stack.push({'x': x.ctor, 'y': y.ctor});
				}
				if (c !== Object.keys(y).length)
				{
					return false;
				}
			}
			else if (typeof x === 'function')
			{
				throw new Error('Equality error: general function equality is ' +
								'undecidable, and therefore, unsupported');
			}
			else
			{
				return false;
			}
		}
		return true;
	}

	// code in Generate/JavaScript.hs depends on the particular
	// integer values assigned to LT, EQ, and GT
	var LT = -1, EQ = 0, GT = 1, ord = ['LT','EQ','GT'];

	function compare(x,y)
	{
		return {
			ctor: ord[cmp(x,y)+1]
		};
	}

	function cmp(x,y) {
		var ord;
		if (typeof x !== 'object')
		{
			return x === y ? EQ : x < y ? LT : GT;
		}
		else if (x.isChar)
		{
			var a = x.toString();
			var b = y.toString();
			return a === b
				? EQ
				: a < b
					? LT
					: GT;
		}
		else if (x.ctor === "::" || x.ctor === "[]")
		{
			while (true)
			{
				if (x.ctor === "[]" && y.ctor === "[]")
				{
					return EQ;
				}
				if (x.ctor !== y.ctor)
				{
					return x.ctor === '[]' ? LT : GT;
				}
				ord = cmp(x._0, y._0);
				if (ord !== EQ)
				{
					return ord;
				}
				x = x._1;
				y = y._1;
			}
		}
		else if (x.ctor.slice(0,6) === '_Tuple')
		{
			var n = x.ctor.slice(6) - 0;
			var err = 'cannot compare tuples with more than 6 elements.';
			if (n === 0) return EQ;
			if (n >= 1) { ord = cmp(x._0, y._0); if (ord !== EQ) return ord;
			if (n >= 2) { ord = cmp(x._1, y._1); if (ord !== EQ) return ord;
			if (n >= 3) { ord = cmp(x._2, y._2); if (ord !== EQ) return ord;
			if (n >= 4) { ord = cmp(x._3, y._3); if (ord !== EQ) return ord;
			if (n >= 5) { ord = cmp(x._4, y._4); if (ord !== EQ) return ord;
			if (n >= 6) { ord = cmp(x._5, y._5); if (ord !== EQ) return ord;
			if (n >= 7) throw new Error('Comparison error: ' + err); } } } } } }
			return EQ;
		}
		else
		{
			throw new Error('Comparison error: comparison is only defined on ints, ' +
							'floats, times, chars, strings, lists of comparable values, ' +
							'and tuples of comparable values.');
		}
	}


	var Tuple0 = {
		ctor: "_Tuple0"
	};

	function Tuple2(x,y)
	{
		return {
			ctor: "_Tuple2",
			_0: x,
			_1: y
		};
	}

	function chr(c)
	{
		var x = new String(c);
		x.isChar = true;
		return x;
	}

	function txt(str)
	{
		var t = new String(str);
		t.text = true;
		return t;
	}

	var count = 0;
	function guid(_)
	{
		return count++
	}

	function copy(oldRecord)
	{
		var newRecord = {};
		for (var key in oldRecord)
		{
			var value = key === '_'
				? copy(oldRecord._)
				: oldRecord[key];
			newRecord[key] = value;
		}
		return newRecord;
	}

	function remove(key, oldRecord)
	{
		var record = copy(oldRecord);
		if (key in record._)
		{
			record[key] = record._[key][0];
			record._[key] = record._[key].slice(1);
			if (record._[key].length === 0)
			{
				delete record._[key];
			}
		}
		else
		{
			delete record[key];
		}
		return record;
	}

	function replace(keyValuePairs, oldRecord)
	{
		var record = copy(oldRecord);
		for (var i = keyValuePairs.length; i--; )
		{
			var pair = keyValuePairs[i];
			record[pair[0]] = pair[1];
		}
		return record;
	}

	function insert(key, value, oldRecord)
	{
		var newRecord = copy(oldRecord);
		if (key in newRecord)
		{
			var values = newRecord._[key];
			var copiedValues = values ? values.slice(0) : [];
			newRecord._[key] = [newRecord[key]].concat(copiedValues);
		}
		newRecord[key] = value;
		return newRecord;
	}

	function getXY(e)
	{
		var posx = 0;
		var posy = 0;
		if (e.pageX || e.pageY)
		{
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY)
		{
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		if (localRuntime.isEmbed())
		{
			var rect = localRuntime.node.getBoundingClientRect();
			var relx = rect.left + document.body.scrollLeft + document.documentElement.scrollLeft;
			var rely = rect.top + document.body.scrollTop + document.documentElement.scrollTop;
			// TODO: figure out if there is a way to avoid rounding here
			posx = posx - Math.round(relx) - localRuntime.node.clientLeft;
			posy = posy - Math.round(rely) - localRuntime.node.clientTop;
		}
		return Tuple2(posx, posy);
	}


	//// LIST STUFF ////

	var Nil = { ctor:'[]' };

	function Cons(hd,tl)
	{
		return {
			ctor: "::",
			_0: hd,
			_1: tl
		};
	}

	function append(xs,ys)
	{
		// append Strings
		if (typeof xs === "string")
		{
			return xs + ys;
		}

		// append Text
		if (xs.ctor.slice(0,5) === 'Text:')
		{
			return {
				ctor: 'Text:Append',
				_0: xs,
				_1: ys
			};
		}



		// append Lists
		if (xs.ctor === '[]')
		{
			return ys;
		}
		var root = Cons(xs._0, Nil);
		var curr = root;
		xs = xs._1;
		while (xs.ctor !== '[]')
		{
			curr._1 = Cons(xs._0, Nil);
			xs = xs._1;
			curr = curr._1;
		}
		curr._1 = ys;
		return root;
	}

	//// RUNTIME ERRORS ////

	function indent(lines)
	{
		return '\n' + lines.join('\n');
	}

	function badCase(moduleName, span)
	{
		var msg = indent([
			'Non-exhaustive pattern match in case-expression.',
			'Make sure your patterns cover every case!'
		]);
		throw new Error('Runtime error in module ' + moduleName + ' (' + span + ')' + msg);
	}

	function badIf(moduleName, span)
	{
		var msg = indent([
			'Non-exhaustive pattern match in multi-way-if expression.',
			'It is best to use \'otherwise\' as the last branch of multi-way-if.'
		]);
		throw new Error('Runtime error in module ' + moduleName + ' (' + span + ')' + msg);
	}


	function badPort(expected, received)
	{
		var msg = indent([
			'Expecting ' + expected + ' but was given ',
			JSON.stringify(received)
		]);
		throw new Error('Runtime error when sending values through a port.' + msg);
	}


	return localRuntime.Native.Utils.values = {
		eq: eq,
		cmp: cmp,
		compare: F2(compare),
		Tuple0: Tuple0,
		Tuple2: Tuple2,
		chr: chr,
		txt: txt,
		copy: copy,
		remove: remove,
		replace: replace,
		insert: insert,
		guid: guid,
		getXY: getXY,

		Nil: Nil,
		Cons: Cons,
		append: F2(append),

		badCase: badCase,
		badIf: badIf,
		badPort: badPort
	};
};

Elm.Native.Vendor = Elm.Native.Vendor || {};
Elm.Native.Vendor.make = function(elm) {
    elm.Native = elm.Native || {};
    elm.Native.Vendor = elm.Native.Vendor || {};
    if (elm.Native.Vendor.values) return elm.Native.Vendor.values;

    // thanks to -- https://github.com/daniel-lundin/snabbt.js/blob/master/snabbt.js
    var styles = window.getComputedStyle(document.documentElement, '');
    var vendorPrefix = (Array.prototype.slice
        .call(styles)
        .join('')
        .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1];

    return elm.Native.Vendor.values = { prefix: vendorPrefix };
};

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],3:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],4:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],5:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":13,"is-object":3}],6:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":11,"../vnode/is-vnode.js":14,"../vnode/is-vtext.js":15,"../vnode/is-widget.js":16,"./apply-properties":5,"global/document":2}],7:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],8:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var render = require("./create-element")
var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":16,"../vnode/vpatch.js":19,"./apply-properties":5,"./create-element":6,"./update-widget":10}],9:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches) {
    return patchRecursive(rootNode, patches)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions) {
        renderOptions = { patch: patchRecursive }
        if (ownerDocument !== document) {
            renderOptions.document = ownerDocument
        }
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./dom-index":7,"./patch-op":8,"global/document":2,"x-is-array":4}],10:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":16}],11:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":12,"./is-vnode":14,"./is-vtext":15,"./is-widget":16}],12:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],13:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],14:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":17}],15:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":17}],16:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],17:[function(require,module,exports){
module.exports = "2"

},{}],18:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":12,"./is-vhook":13,"./is-vnode":14,"./is-widget":16,"./version":17}],19:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":17}],20:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":17}],21:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":13,"is-object":3}],22:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free,     // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":11,"../vnode/is-thunk":12,"../vnode/is-vnode":14,"../vnode/is-vtext":15,"../vnode/is-widget":16,"../vnode/vpatch":19,"./diff-props":21,"x-is-array":4}],23:[function(require,module,exports){
var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');
var diff = require('virtual-dom/vtree/diff');
var patch = require('virtual-dom/vdom/patch');
var createElement = require('virtual-dom/vdom/create-element');
var isHook = require("virtual-dom/vnode/is-vhook");


Elm.Native.VirtualDom = {};
Elm.Native.VirtualDom.make = function(elm)
{
	elm.Native = elm.Native || {};
	elm.Native.VirtualDom = elm.Native.VirtualDom || {};
	if (elm.Native.VirtualDom.values)
	{
		return elm.Native.VirtualDom.values;
	}

	var Element = Elm.Native.Graphics.Element.make(elm);
	var Json = Elm.Native.Json.make(elm);
	var List = Elm.Native.List.make(elm);
	var Signal = Elm.Native.Signal.make(elm);
	var Utils = Elm.Native.Utils.make(elm);

	var ATTRIBUTE_KEY = 'UniqueNameThatOthersAreVeryUnlikelyToUse';



	// VIRTUAL DOM NODES


	function text(string)
	{
		return new VText(string);
	}

	function node(name)
	{
		return F2(function(propertyList, contents) {
			return makeNode(name, propertyList, contents);
		});
	}


	// BUILD VIRTUAL DOME NODES


	function makeNode(name, propertyList, contents)
	{
		var props = listToProperties(propertyList);

		var key, namespace;
		// support keys
		if (props.key !== undefined)
		{
			key = props.key;
			props.key = undefined;
		}

		// support namespace
		if (props.namespace !== undefined)
		{
			namespace = props.namespace;
			props.namespace = undefined;
		}

		// ensure that setting text of an input does not move the cursor
		var useSoftSet =
			(name === 'input' || name === 'textarea')
			&& props.value !== undefined
			&& !isHook(props.value);

		if (useSoftSet)
		{
			props.value = SoftSetHook(props.value);
		}

		return new VNode(name, props, List.toArray(contents), key, namespace);
	}

	function listToProperties(list)
	{
		var object = {};
		while (list.ctor !== '[]')
		{
			var entry = list._0;
			if (entry.key === ATTRIBUTE_KEY)
			{
				object.attributes = object.attributes || {};
				object.attributes[entry.value.attrKey] = entry.value.attrValue;
			}
			else
			{
				object[entry.key] = entry.value;
			}
			list = list._1;
		}
		return object;
	}



	// PROPERTIES AND ATTRIBUTES


	function property(key, value)
	{
		return {
			key: key,
			value: value
		};
	}

	function attribute(key, value)
	{
		return {
			key: ATTRIBUTE_KEY,
			value: {
				attrKey: key,
				attrValue: value
			}
		};
	}



	// NAMESPACED ATTRIBUTES


	function attributeNS(namespace, key, value)
	{
		return {
			key: key,
			value: new AttributeHook(namespace, key, value)
		};
	}

	function AttributeHook(namespace, key, value)
	{
		if (!(this instanceof AttributeHook))
		{
			return new AttributeHook(namespace, key, value);
		}

		this.namespace = namespace;
		this.key = key;
		this.value = value;
	}

	AttributeHook.prototype.hook = function (node, prop, prev)
	{
		if (prev
			&& prev.type === 'AttributeHook'
			&& prev.value === this.value
			&& prev.namespace === this.namespace)
		{
			return;
		}

		node.setAttributeNS(this.namespace, prop, this.value);
	};

	AttributeHook.prototype.unhook = function (node, prop, next)
	{
		if (next
			&& next.type === 'AttributeHook'
			&& next.namespace === this.namespace)
		{
			return;
		}

		node.removeAttributeNS(this.namespace, this.key);
	};

	AttributeHook.prototype.type = 'AttributeHook';



	// EVENTS


	function on(name, options, decoder, createMessage)
	{
		function eventHandler(event)
		{
			var value = A2(Json.runDecoderValue, decoder, event);
			if (value.ctor === 'Ok')
			{
				if (options.stopPropagation)
				{
					event.stopPropagation();
				}
				if (options.preventDefault)
				{
					event.preventDefault();
				}
				Signal.sendMessage(createMessage(value._0));
			}
		}
		return property('on' + name, eventHandler);
	}

	function SoftSetHook(value)
	{
		if (!(this instanceof SoftSetHook))
		{
			return new SoftSetHook(value);
		}

		this.value = value;
	}

	SoftSetHook.prototype.hook = function (node, propertyName)
	{
		if (node[propertyName] !== this.value)
		{
			node[propertyName] = this.value;
		}
	};



	// INTEGRATION WITH ELEMENTS


	function ElementWidget(element)
	{
		this.element = element;
	}

	ElementWidget.prototype.type = "Widget";

	ElementWidget.prototype.init = function init()
	{
		return Element.render(this.element);
	};

	ElementWidget.prototype.update = function update(previous, node)
	{
		return Element.update(node, previous.element, this.element);
	};

	function fromElement(element)
	{
		return new ElementWidget(element);
	}

	function toElement(width, height, html)
	{
		return A3(Element.newElement, width, height, {
			ctor: 'Custom',
			type: 'evancz/elm-html',
			render: render,
			update: update,
			model: html
		});
	}



	// RENDER AND UPDATE


	function render(model)
	{
		var element = Element.createNode('div');
		element.appendChild(createElement(model));
		return element;
	}

	function update(node, oldModel, newModel)
	{
		updateAndReplace(node.firstChild, oldModel, newModel);
		return node;
	}

	function updateAndReplace(node, oldModel, newModel)
	{
		var patches = diff(oldModel, newModel);
		var newNode = patch(node, patches);
		return newNode;
	}



	// LAZINESS


	function lazyRef(fn, a)
	{
		function thunk()
		{
			return fn(a);
		}
		return new Thunk(fn, [a], thunk);
	}

	function lazyRef2(fn, a, b)
	{
		function thunk()
		{
			return A2(fn, a, b);
		}
		return new Thunk(fn, [a,b], thunk);
	}

	function lazyRef3(fn, a, b, c)
	{
		function thunk()
		{
			return A3(fn, a, b, c);
		}
		return new Thunk(fn, [a,b,c], thunk);
	}

	function Thunk(fn, args, thunk)
	{
		/* public (used by VirtualDom.js) */
		this.vnode = null;
		this.key = undefined;

		/* private */
		this.fn = fn;
		this.args = args;
		this.thunk = thunk;
	}

	Thunk.prototype.type = "Thunk";
	Thunk.prototype.render = renderThunk;

	function shouldUpdate(current, previous)
	{
		if (current.fn !== previous.fn)
		{
			return true;
		}

		// if it's the same function, we know the number of args must match
		var cargs = current.args;
		var pargs = previous.args;

		for (var i = cargs.length; i--; )
		{
			if (cargs[i] !== pargs[i])
			{
				return true;
			}
		}

		return false;
	}

	function renderThunk(previous)
	{
		if (previous == null || shouldUpdate(this, previous))
		{
			return this.thunk();
		}
		else
		{
			return previous.vnode;
		}
	}


	return elm.Native.VirtualDom.values = Elm.Native.VirtualDom.values = {
		node: node,
		text: text,
		on: F4(on),

		property: F2(property),
		attribute: F2(attribute),
		attributeNS: F3(attributeNS),

		lazy: F2(lazyRef),
		lazy2: F3(lazyRef2),
		lazy3: F4(lazyRef3),

		toElement: F3(toElement),
		fromElement: fromElement,

		render: createElement,
		updateAndReplace: updateAndReplace
	};
};

},{"virtual-dom/vdom/create-element":6,"virtual-dom/vdom/patch":9,"virtual-dom/vnode/is-vhook":13,"virtual-dom/vnode/vnode":18,"virtual-dom/vnode/vtext":20,"virtual-dom/vtree/diff":22}]},{},[23]);

Elm.Native = Elm.Native || {};
Elm.Native.Window = {};
Elm.Native.Window.make = function(localRuntime) {

	localRuntime.Native = localRuntime.Native || {};
	localRuntime.Native.Window = localRuntime.Native.Window || {};
	if (localRuntime.Native.Window.values)
	{
		return localRuntime.Native.Window.values;
	}

	var NS = Elm.Native.Signal.make(localRuntime);
	var Tuple2 = Elm.Native.Utils.make(localRuntime).Tuple2;


	function getWidth()
	{
		return localRuntime.node.clientWidth;
	}


	function getHeight()
	{
		if (localRuntime.isFullscreen())
		{
			return window.innerHeight;
		}
		return localRuntime.node.clientHeight;
	}


	var dimensions = NS.input('Window.dimensions', Tuple2(getWidth(), getHeight()));


	function resizeIfNeeded()
	{
		// Do not trigger event if the dimensions have not changed.
		// This should be most of the time.
		var w = getWidth();
		var h = getHeight();
		if (dimensions.value._0 === w && dimensions.value._1 === h)
		{
			return;
		}

		setTimeout(function () {
			// Check again to see if the dimensions have changed.
			// It is conceivable that the dimensions have changed
			// again while some other event was being processed.
			var w = getWidth();
			var h = getHeight();
			if (dimensions.value._0 === w && dimensions.value._1 === h)
			{
				return;
			}
			localRuntime.notify(dimensions.id, Tuple2(w,h));
		}, 0);
	}


	localRuntime.addListener([dimensions.id], window, 'resize', resizeIfNeeded);


	return localRuntime.Native.Window.values = {
		dimensions: dimensions,
		resizeIfNeeded: resizeIfNeeded
	};
};

Elm.Regex = Elm.Regex || {};
Elm.Regex.make = function (_elm) {
   "use strict";
   _elm.Regex = _elm.Regex || {};
   if (_elm.Regex.values)
   return _elm.Regex.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Regex",
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Regex = Elm.Native.Regex.make(_elm);
   var split = $Native$Regex.split;
   var replace = $Native$Regex.replace;
   var find = $Native$Regex.find;
   var AtMost = function (a) {
      return {ctor: "AtMost"
             ,_0: a};
   };
   var All = {ctor: "All"};
   var Match = F4(function (a,
   b,
   c,
   d) {
      return {_: {}
             ,index: c
             ,match: a
             ,number: d
             ,submatches: b};
   });
   var contains = $Native$Regex.contains;
   var caseInsensitive = $Native$Regex.caseInsensitive;
   var regex = $Native$Regex.regex;
   var escape = $Native$Regex.escape;
   var Regex = {ctor: "Regex"};
   _elm.Regex.values = {_op: _op
                       ,regex: regex
                       ,escape: escape
                       ,caseInsensitive: caseInsensitive
                       ,contains: contains
                       ,find: find
                       ,replace: replace
                       ,split: split
                       ,Match: Match
                       ,All: All
                       ,AtMost: AtMost};
   return _elm.Regex.values;
};
Elm.Result = Elm.Result || {};
Elm.Result.make = function (_elm) {
   "use strict";
   _elm.Result = _elm.Result || {};
   if (_elm.Result.values)
   return _elm.Result.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Result",
   $Maybe = Elm.Maybe.make(_elm);
   var toMaybe = function (result) {
      return function () {
         switch (result.ctor)
         {case "Err":
            return $Maybe.Nothing;
            case "Ok":
            return $Maybe.Just(result._0);}
         _U.badCase($moduleName,
         "between lines 164 and 166");
      }();
   };
   var Err = function (a) {
      return {ctor: "Err",_0: a};
   };
   var andThen = F2(function (result,
   callback) {
      return function () {
         switch (result.ctor)
         {case "Err":
            return Err(result._0);
            case "Ok":
            return callback(result._0);}
         _U.badCase($moduleName,
         "between lines 126 and 128");
      }();
   });
   var Ok = function (a) {
      return {ctor: "Ok",_0: a};
   };
   var map = F2(function (func,
   ra) {
      return function () {
         switch (ra.ctor)
         {case "Err": return Err(ra._0);
            case "Ok":
            return Ok(func(ra._0));}
         _U.badCase($moduleName,
         "between lines 41 and 43");
      }();
   });
   var map2 = F3(function (func,
   ra,
   rb) {
      return function () {
         var _v9 = {ctor: "_Tuple2"
                   ,_0: ra
                   ,_1: rb};
         switch (_v9.ctor)
         {case "_Tuple2":
            switch (_v9._0.ctor)
              {case "Err":
                 return Err(_v9._0._0);
                 case "Ok": switch (_v9._1.ctor)
                   {case "Ok": return Ok(A2(func,
                        _v9._0._0,
                        _v9._1._0));}
                   break;}
              switch (_v9._1.ctor)
              {case "Err":
                 return Err(_v9._1._0);}
              break;}
         _U.badCase($moduleName,
         "between lines 55 and 58");
      }();
   });
   var map3 = F4(function (func,
   ra,
   rb,
   rc) {
      return function () {
         var _v16 = {ctor: "_Tuple3"
                    ,_0: ra
                    ,_1: rb
                    ,_2: rc};
         switch (_v16.ctor)
         {case "_Tuple3":
            switch (_v16._0.ctor)
              {case "Err":
                 return Err(_v16._0._0);
                 case "Ok": switch (_v16._1.ctor)
                   {case "Ok":
                      switch (_v16._2.ctor)
                        {case "Ok": return Ok(A3(func,
                             _v16._0._0,
                             _v16._1._0,
                             _v16._2._0));}
                        break;}
                   break;}
              switch (_v16._1.ctor)
              {case "Err":
                 return Err(_v16._1._0);}
              switch (_v16._2.ctor)
              {case "Err":
                 return Err(_v16._2._0);}
              break;}
         _U.badCase($moduleName,
         "between lines 63 and 67");
      }();
   });
   var map4 = F5(function (func,
   ra,
   rb,
   rc,
   rd) {
      return function () {
         var _v26 = {ctor: "_Tuple4"
                    ,_0: ra
                    ,_1: rb
                    ,_2: rc
                    ,_3: rd};
         switch (_v26.ctor)
         {case "_Tuple4":
            switch (_v26._0.ctor)
              {case "Err":
                 return Err(_v26._0._0);
                 case "Ok": switch (_v26._1.ctor)
                   {case "Ok":
                      switch (_v26._2.ctor)
                        {case "Ok":
                           switch (_v26._3.ctor)
                             {case "Ok": return Ok(A4(func,
                                  _v26._0._0,
                                  _v26._1._0,
                                  _v26._2._0,
                                  _v26._3._0));}
                             break;}
                        break;}
                   break;}
              switch (_v26._1.ctor)
              {case "Err":
                 return Err(_v26._1._0);}
              switch (_v26._2.ctor)
              {case "Err":
                 return Err(_v26._2._0);}
              switch (_v26._3.ctor)
              {case "Err":
                 return Err(_v26._3._0);}
              break;}
         _U.badCase($moduleName,
         "between lines 72 and 77");
      }();
   });
   var map5 = F6(function (func,
   ra,
   rb,
   rc,
   rd,
   re) {
      return function () {
         var _v39 = {ctor: "_Tuple5"
                    ,_0: ra
                    ,_1: rb
                    ,_2: rc
                    ,_3: rd
                    ,_4: re};
         switch (_v39.ctor)
         {case "_Tuple5":
            switch (_v39._0.ctor)
              {case "Err":
                 return Err(_v39._0._0);
                 case "Ok": switch (_v39._1.ctor)
                   {case "Ok":
                      switch (_v39._2.ctor)
                        {case "Ok":
                           switch (_v39._3.ctor)
                             {case "Ok":
                                switch (_v39._4.ctor)
                                  {case "Ok": return Ok(A5(func,
                                       _v39._0._0,
                                       _v39._1._0,
                                       _v39._2._0,
                                       _v39._3._0,
                                       _v39._4._0));}
                                  break;}
                             break;}
                        break;}
                   break;}
              switch (_v39._1.ctor)
              {case "Err":
                 return Err(_v39._1._0);}
              switch (_v39._2.ctor)
              {case "Err":
                 return Err(_v39._2._0);}
              switch (_v39._3.ctor)
              {case "Err":
                 return Err(_v39._3._0);}
              switch (_v39._4.ctor)
              {case "Err":
                 return Err(_v39._4._0);}
              break;}
         _U.badCase($moduleName,
         "between lines 82 and 88");
      }();
   });
   var formatError = F2(function (f,
   result) {
      return function () {
         switch (result.ctor)
         {case "Err":
            return Err(f(result._0));
            case "Ok":
            return Ok(result._0);}
         _U.badCase($moduleName,
         "between lines 148 and 150");
      }();
   });
   var fromMaybe = F2(function (err,
   maybe) {
      return function () {
         switch (maybe.ctor)
         {case "Just":
            return Ok(maybe._0);
            case "Nothing":
            return Err(err);}
         _U.badCase($moduleName,
         "between lines 180 and 182");
      }();
   });
   _elm.Result.values = {_op: _op
                        ,map: map
                        ,map2: map2
                        ,map3: map3
                        ,map4: map4
                        ,map5: map5
                        ,andThen: andThen
                        ,toMaybe: toMaybe
                        ,fromMaybe: fromMaybe
                        ,formatError: formatError
                        ,Ok: Ok
                        ,Err: Err};
   return _elm.Result.values;
};
Elm.SelectionList = Elm.SelectionList || {};
Elm.SelectionList.make = function (_elm) {
   "use strict";
   _elm.SelectionList = _elm.SelectionList || {};
   if (_elm.SelectionList.values)
   return _elm.SelectionList.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "SelectionList",
   $Basics = Elm.Basics.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var selectedIndex = function (list) {
      return $List.length(list.previous);
   };
   var previous = function (list) {
      return function () {
         var _v0 = list.previous;
         switch (_v0.ctor)
         {case "::":
            return _U.replace([["selected"
                               ,_v0._0]
                              ,["previous",_v0._1]
                              ,["next"
                               ,A2($List._op["::"],
                               list.selected,
                               list.next)]],
              list);
            case "[]": return list;}
         _U.badCase($moduleName,
         "between lines 149 and 157");
      }();
   };
   var next = function (list) {
      return function () {
         var _v3 = list.next;
         switch (_v3.ctor)
         {case "::":
            return _U.replace([["selected"
                               ,_v3._0]
                              ,["previous"
                               ,A2($List._op["::"],
                               list.selected,
                               list.previous)]
                              ,["next",_v3._1]],
              list);
            case "[]": return list;}
         _U.badCase($moduleName,
         "between lines 133 and 141");
      }();
   };
   var $goto = F2(function (n,
   list) {
      return function () {
         var curIndex = selectedIndex(list);
         return _U.eq(curIndex,
         n) ? list : _U.cmp(curIndex,
         n) < 0 && _U.cmp($List.length(list.next),
         0) > 0 ? A2($goto,
         n,
         next(list)) : _U.cmp(curIndex,
         A2($Basics.max,
         0,
         n)) > 0 ? A2($goto,
         n,
         previous(list)) : list;
      }();
   });
   var selectedMap = F2(function (f,
   list) {
      return _U.replace([["previous"
                         ,A2($List.map,
                         f(false),
                         list.previous)]
                        ,["selected"
                         ,A2(f,true,list.selected)]
                        ,["next"
                         ,A2($List.map,
                         f(false),
                         list.next)]],
      list);
   });
   var indexedMap = F2(function (f,
   list) {
      return function () {
         var nextLength = $List.length(list.next);
         var previousLength = $List.length(list.previous);
         return _U.replace([["previous"
                            ,$List.reverse(A2($List.indexedMap,
                            f,
                            $List.reverse(list.previous)))]
                           ,["selected"
                            ,A2(f,
                            previousLength,
                            list.selected)]
                           ,["next"
                            ,A2($List.indexedMap,
                            function (index) {
                               return f(index + previousLength + 1);
                            },
                            list.next)]],
         list);
      }();
   });
   var map2 = F3(function (f,
   listA,
   listB) {
      return _U.replace([["previous"
                         ,A3($List.map2,
                         f,
                         listA.previous,
                         listB.previous)]
                        ,["selected"
                         ,A2(f,
                         listA.selected,
                         listB.selected)]
                        ,["next"
                         ,A3($List.map2,
                         f,
                         listA.next,
                         listB.next)]],
      listA);
   });
   var andMap = map2(F2(function (x,
   y) {
      return x(y);
   }));
   var updateN = F3(function (n,
   f,
   list) {
      return A2(indexedMap,
      F2(function (index,value) {
         return _U.eq(index,
         n) ? f(value) : value;
      }),
      list);
   });
   var updateSelected = F2(function (f,
   list) {
      return _U.replace([["selected"
                         ,f(list.selected)]],
      list);
   });
   var map = F2(function (f,list) {
      return _U.replace([["previous"
                         ,A2($List.map,f,list.previous)]
                        ,["selected",f(list.selected)]
                        ,["next"
                         ,A2($List.map,f,list.next)]],
      list);
   });
   var length = function (list) {
      return $List.length(list.previous) + 1 + $List.length(list.next);
   };
   var toList = function (list) {
      return A2($Basics._op["++"],
      $List.reverse(list.previous),
      A2($Basics._op["++"],
      _L.fromArray([list.selected]),
      list.next));
   };
   var SelectionList = F3(function (a,
   b,
   c) {
      return {_: {}
             ,next: c
             ,previous: a
             ,selected: b};
   });
   var fromList = F2(function (selected,
   next) {
      return A3(SelectionList,
      _L.fromArray([]),
      selected,
      next);
   });
   _elm.SelectionList.values = {_op: _op
                               ,SelectionList: SelectionList
                               ,toList: toList
                               ,fromList: fromList
                               ,length: length
                               ,map: map
                               ,updateSelected: updateSelected
                               ,updateN: updateN
                               ,map2: map2
                               ,andMap: andMap
                               ,indexedMap: indexedMap
                               ,selectedMap: selectedMap
                               ,next: next
                               ,previous: previous
                               ,selectedIndex: selectedIndex
                               ,$goto: $goto};
   return _elm.SelectionList.values;
};
Elm.Set = Elm.Set || {};
Elm.Set.make = function (_elm) {
   "use strict";
   _elm.Set = _elm.Set || {};
   if (_elm.Set.values)
   return _elm.Set.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Set",
   $Dict = Elm.Dict.make(_elm),
   $List = Elm.List.make(_elm);
   var partition = F2(function (p,
   set) {
      return A2($Dict.partition,
      F2(function (k,_v0) {
         return function () {
            return p(k);
         }();
      }),
      set);
   });
   var filter = F2(function (p,
   set) {
      return A2($Dict.filter,
      F2(function (k,_v2) {
         return function () {
            return p(k);
         }();
      }),
      set);
   });
   var foldr = F3(function (f,
   b,
   s) {
      return A3($Dict.foldr,
      F3(function (k,_v4,b) {
         return function () {
            return A2(f,k,b);
         }();
      }),
      b,
      s);
   });
   var foldl = F3(function (f,
   b,
   s) {
      return A3($Dict.foldl,
      F3(function (k,_v6,b) {
         return function () {
            return A2(f,k,b);
         }();
      }),
      b,
      s);
   });
   var toList = $Dict.keys;
   var diff = $Dict.diff;
   var intersect = $Dict.intersect;
   var union = $Dict.union;
   var member = $Dict.member;
   var isEmpty = $Dict.isEmpty;
   var remove = $Dict.remove;
   var insert = function (k) {
      return A2($Dict.insert,
      k,
      {ctor: "_Tuple0"});
   };
   var singleton = function (k) {
      return A2($Dict.singleton,
      k,
      {ctor: "_Tuple0"});
   };
   var empty = $Dict.empty;
   var fromList = function (xs) {
      return A3($List.foldl,
      insert,
      empty,
      xs);
   };
   var map = F2(function (f,s) {
      return fromList(A2($List.map,
      f,
      toList(s)));
   });
   _elm.Set.values = {_op: _op
                     ,empty: empty
                     ,singleton: singleton
                     ,insert: insert
                     ,remove: remove
                     ,isEmpty: isEmpty
                     ,member: member
                     ,foldl: foldl
                     ,foldr: foldr
                     ,map: map
                     ,filter: filter
                     ,partition: partition
                     ,union: union
                     ,intersect: intersect
                     ,diff: diff
                     ,toList: toList
                     ,fromList: fromList};
   return _elm.Set.values;
};
Elm.Signal = Elm.Signal || {};
Elm.Signal.make = function (_elm) {
   "use strict";
   _elm.Signal = _elm.Signal || {};
   if (_elm.Signal.values)
   return _elm.Signal.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Signal",
   $Basics = Elm.Basics.make(_elm),
   $Debug = Elm.Debug.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Signal = Elm.Native.Signal.make(_elm),
   $Task = Elm.Task.make(_elm);
   var send = F2(function (_v0,
   value) {
      return function () {
         switch (_v0.ctor)
         {case "Address":
            return A2($Task.onError,
              _v0._0(value),
              function (_v3) {
                 return function () {
                    return $Task.succeed({ctor: "_Tuple0"});
                 }();
              });}
         _U.badCase($moduleName,
         "between lines 370 and 371");
      }();
   });
   var Message = function (a) {
      return {ctor: "Message"
             ,_0: a};
   };
   var message = F2(function (_v5,
   value) {
      return function () {
         switch (_v5.ctor)
         {case "Address":
            return Message(_v5._0(value));}
         _U.badCase($moduleName,
         "on line 352, column 5 to 24");
      }();
   });
   var mailbox = $Native$Signal.mailbox;
   var Address = function (a) {
      return {ctor: "Address"
             ,_0: a};
   };
   var forwardTo = F2(function (_v8,
   f) {
      return function () {
         switch (_v8.ctor)
         {case "Address":
            return Address(function (x) {
                 return _v8._0(f(x));
              });}
         _U.badCase($moduleName,
         "on line 339, column 5 to 29");
      }();
   });
   var Mailbox = F2(function (a,
   b) {
      return {_: {}
             ,address: a
             ,signal: b};
   });
   var sampleOn = $Native$Signal.sampleOn;
   var dropRepeats = $Native$Signal.dropRepeats;
   var filterMap = $Native$Signal.filterMap;
   var filter = F3(function (isOk,
   base,
   signal) {
      return A3(filterMap,
      function (value) {
         return isOk(value) ? $Maybe.Just(value) : $Maybe.Nothing;
      },
      base,
      signal);
   });
   var merge = F2(function (left,
   right) {
      return A3($Native$Signal.genericMerge,
      $Basics.always,
      left,
      right);
   });
   var mergeMany = function (signalList) {
      return function () {
         var _v11 = $List.reverse(signalList);
         switch (_v11.ctor)
         {case "::":
            return A3($List.foldl,
              merge,
              _v11._0,
              _v11._1);
            case "[]":
            return $Debug.crash("mergeMany was given an empty list!");}
         _U.badCase($moduleName,
         "between lines 177 and 182");
      }();
   };
   var foldp = $Native$Signal.foldp;
   var map5 = $Native$Signal.map5;
   var map4 = $Native$Signal.map4;
   var map3 = $Native$Signal.map3;
   var map2 = $Native$Signal.map2;
   _op["~"] = F2(function (funcs,
   args) {
      return A3(map2,
      F2(function (f,v) {
         return f(v);
      }),
      funcs,
      args);
   });
   var map = $Native$Signal.map;
   _op["<~"] = map;
   var constant = $Native$Signal.constant;
   var Signal = {ctor: "Signal"};
   _elm.Signal.values = {_op: _op
                        ,merge: merge
                        ,mergeMany: mergeMany
                        ,map: map
                        ,map2: map2
                        ,map3: map3
                        ,map4: map4
                        ,map5: map5
                        ,constant: constant
                        ,dropRepeats: dropRepeats
                        ,filter: filter
                        ,filterMap: filterMap
                        ,sampleOn: sampleOn
                        ,foldp: foldp
                        ,mailbox: mailbox
                        ,send: send
                        ,message: message
                        ,forwardTo: forwardTo
                        ,Mailbox: Mailbox};
   return _elm.Signal.values;
};
Elm.StartApp = Elm.StartApp || {};
Elm.StartApp.make = function (_elm) {
   "use strict";
   _elm.StartApp = _elm.StartApp || {};
   if (_elm.StartApp.values)
   return _elm.StartApp.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "StartApp",
   $Basics = Elm.Basics.make(_elm),
   $Effects = Elm.Effects.make(_elm),
   $Html = Elm.Html.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm),
   $Task = Elm.Task.make(_elm);
   var start = function (config) {
      return function () {
         var updateStep = F2(function (action,
         _v0) {
            return function () {
               switch (_v0.ctor)
               {case "_Tuple2":
                  return function () {
                       var $ = A2(config.update,
                       action,
                       _v0._0),
                       newModel = $._0,
                       additionalEffects = $._1;
                       return {ctor: "_Tuple2"
                              ,_0: newModel
                              ,_1: $Effects.batch(_L.fromArray([_v0._1
                                                               ,additionalEffects]))};
                    }();}
               _U.badCase($moduleName,
               "between lines 94 and 97");
            }();
         });
         var update = F2(function (actions,
         _v4) {
            return function () {
               switch (_v4.ctor)
               {case "_Tuple2":
                  return A3($List.foldl,
                    updateStep,
                    {ctor: "_Tuple2"
                    ,_0: _v4._0
                    ,_1: $Effects.none},
                    actions);}
               _U.badCase($moduleName,
               "on line 101, column 13 to 64");
            }();
         });
         var messages = $Signal.mailbox(_L.fromArray([]));
         var singleton = function (action) {
            return _L.fromArray([action]);
         };
         var address = A2($Signal.forwardTo,
         messages.address,
         singleton);
         var inputs = $Signal.mergeMany(A2($List._op["::"],
         messages.signal,
         A2($List.map,
         $Signal.map(singleton),
         config.inputs)));
         var effectsAndModel = A3($Signal.foldp,
         update,
         config.init,
         inputs);
         var model = A2($Signal.map,
         $Basics.fst,
         effectsAndModel);
         return {_: {}
                ,html: A2($Signal.map,
                config.view(address),
                model)
                ,model: model
                ,tasks: A2($Signal.map,
                function ($) {
                   return $Effects.toTask(messages.address)($Basics.snd($));
                },
                effectsAndModel)};
      }();
   };
   var App = F3(function (a,b,c) {
      return {_: {}
             ,html: a
             ,model: b
             ,tasks: c};
   });
   var Config = F4(function (a,
   b,
   c,
   d) {
      return {_: {}
             ,init: a
             ,inputs: d
             ,update: b
             ,view: c};
   });
   _elm.StartApp.values = {_op: _op
                          ,start: start
                          ,Config: Config
                          ,App: App};
   return _elm.StartApp.values;
};
Elm.StoryContent = Elm.StoryContent || {};
Elm.StoryContent.make = function (_elm) {
   "use strict";
   _elm.StoryContent = _elm.StoryContent || {};
   if (_elm.StoryContent.values)
   return _elm.StoryContent.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "StoryContent",
   $Basics = Elm.Basics.make(_elm),
   $Dict = Elm.Dict.make(_elm),
   $InteractiveStory$Action = Elm.InteractiveStory.Action.make(_elm),
   $InteractiveStory$Sound = Elm.InteractiveStory.Sound.make(_elm),
   $InteractiveStory$StoryBlock = Elm.InteractiveStory.StoryBlock.make(_elm),
   $List = Elm.List.make(_elm),
   $Markdown = Elm.Markdown.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var go_home_good_ending = "\nA portal opens beside Arlene, and she sighs. \"Oh, dear. This again... I guess this means the night really is over. Well, I had a lot of fun! I think I shall remember this night for quite some time.\" She moves towards the portal, pokes a hesitant finger into it, then looks back at you. \"See you back at the Party!\" With that, she disappears into the rift.\n";
   var go_home_confirmed_disapointing_stolen_candy = "\nA portal opens beside Arlene, and she sighs. \"Oh, dear. This again... I guess this means the night really is over... Well, that is quite alright. I should rather end the night early than continue trick or treating with someone who steals candy from children. Hmph.\" She steps into the portal and disappears.\n";
   var go_home_confirmed_stolen_candy = "\n\"Well, then!\" Arlene huffs. \"I didn\'t realize you were such a jerk! Stealing candy from children... of all the things.\" A portal opens beside her, and she steps into it without looking back. Ouch.\n";
   var go_home_confirmed_disapointing = "\nA portal opens beside Arlene, and she sighs. \"Oh, dear. This again... I guess this means the night really is over. I shall see you back at the Party, I suppose!\" She steps into the portal and disappears.\n";
   var goHome_return_candy = " \"Oh, I nearly forgot,\" Arlene continues. \"You\'re still holding onto that candy for those kids, right? Shall we return it before heading back?\"\n";
   var goHome_completion_2 = "\nYou tell Arlene that you\'re ready to head home for the night.\n\n\"Ahh, I was hoping to do a little more trick or treating, but I suppose we *did* cover a lot of ground,\" she says. You can hear in her tone that she\'d like to stick around a bit longer.\n";
   var goHome_completion_1 = "\nYou tell Arlene that you\'re ready to head home for the night.\n\n\"You want to go home *already*? B-but there\'s so much still to do!\" she exclaims.\n";
   var goHome_completion_0 = "\nYou tell Arlene that you\'re ready to head home for the night.\n\n\"What?\" Arlene exclaims. \"We literally *just* got here. A-are you sure you don\'t want to stay a little longer?\" she asks.\n";
   var block44_6 = " Arlene cringes. \"Look,\" he continues. \"I\'m just jokin\' around. No need to take offense. But hey, you seem pretty cool. How\'s about you come egg the schoolhouse with us? The name\'s Henry, by the way.\"\n\nArlene grins. The prospect of egging something seems to have lightened her attitude towards these guys. \"And I\'m Arlene. You can just call my friend here, Reader.\"\n\n\"Reeter?\" Henry asks. \"That\'s a pretty odd name. Alright, Arlene. Reeter. How\'s about egging the school with us?\"\n";
   var block44_5 = "\n\nWhile they are being noisy, Arlene turns to you and whispers, \"Hey, these are the jerks who stole those kids\' candy. Look at those bags.\" She grins meanly. \"Shall we correct this situation?\"\n";
   var block44_4 = "\n\nWhile they are being noisy, Arlene turns to you and whispers, \"Hey, that\'s the jerk who stole our candy.\" She points out a kid hunkered behind his friends, clearly trying to stay out of sight, and grins meanly. \"Shall we correct this situation?\"\n";
   var block44_3 = "\n\nWhile they are being noisy, Arlene turns to you and whispers, \"Hey, that\'s the jerk who stole our candy.\" She points out a kid hunkered behind his friends, clearly trying to stay out of sight. \"Plus, they have those kids\' bags.\" She grins meanly. \"Shall we correct this situation?\"\n";
   var block44_2_1 = "\n\nArlene turns to you and whispers in your ear. \"Egging the school *does* sound fun, but that is definitely those kids\' candy.\" She nods towards the candy bags. \"We should *probably* bring it back to them. What would you like to do?\"\n";
   var block44_2 = "Except for one, who slipped into the background when you and Arlene arrived. He now whispers something to Henry who listens to what his buddy says and gets to his feet, no longer smiling. \"My friend here says you beat him up before and stole his candy. That true?\"\n\nArlene looks at the kid who tattled, and her eyes widen. \"Oh, why hello there!\" she says to the kid, who recoils away from her. \"I didn\'t even recognize you since you weren\'t running away wimpering like a baby.\" She turns back to Henry. \"Yep, he tried to steal candy from me and my friend earlier. So, I kicked his butt.\" She says this all pleasantly and without hesitation. A daring smile appears on her lips. \"Do you have something to say about that?\"\n\nHenry hesitates for a moment, unsure of how to handle her confident tone. His friend draws his attention and shakes his head in warning. Turning back to you, Henry says, \"Hey, no worries. If this dope over here tried to take your candy, he got what was coming to him. But tell ya what, you seem pretty cool. Wanna come with us and egg the schoolhouse?\"\n";
   var block44_1 = "\nYou and Arlene approach the snickering high schoolers. Upon closer inspection, you are almost certain that their candy bags don\'t actually belong to them.\n\nThe high schoolers look up at you as you approach. \"Pfft. Look at this dope,\" the blonde one in the front says, jerking a thumb towards Arlene. The patch on his Letterman jacket reads \"Henry\", and you assume he is the leader of the posse. \"What is she, like 20, and still wearing a costume?\" The others roar with laughter.\n\n\"Well, I never!\" Arlene huffs.\n\n\"Relax, babe, just kidding around with you.\" The others hoot and holler at this.\n";
   var block11 = A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nMostly safely. Your head is spinning, and you feel rather nauseous after nearly being flipped inside out. Somehow, Arlene seems to be doing fine. Better than fine, in fact. She is beaming at you.\n\n\"That. Was. *Awesome!* Can we do it again?\" How she isn\'t feeling ill, you do not know, but at least...\n\nHer smile falters, and she slaps a hand to her mouth. She suddenly looks rather green. \"On second thought...\" she manages, glancing around. \"Perhaps we should find a trash can.\" She takes off down the street. A couple minutes pass before she returns, running and out of breath.\n  ",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "\"Are you all right?\""
                 ,_1: $Maybe.Just("arlene-got-sick")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "\"What happened?\""
                 ,_1: $Maybe.Just("arlene-got-sick-2")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}]),
   true);
   var block07 = $InteractiveStory$StoryBlock.contentBlock("\nWhen Arlene regains her composure, she leads you back to the grand hall where you both stand before the Halloween rift.\n\n\"Oh, one more thing!\" Arlene says. \"Wait here.\" She runs off into the hallway and comes back a minute later with two bags, one with a pumpkin on the front and the other with a black cat. She hands you the one with the pumpkin. \"Okay, *now* we\'re ready. On three, okay?\"\n");
   var block06 = A2($InteractiveStory$StoryBlock.conditionalTextBlock,
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "reader-costume"
                 ,_2: "knight"
                 ,_3: "\nYou leave the changing room fully garbed as a knight of the round table... or some table at least. Arlene claps her hands together happily.\n\n\"Oh, my! How dashing you look, Sir Reader! If we come across any dragons in our quest for sugar, surely you will protect this fair maiden!\" She raises a hand to her forehead in mock faint and laughs wildly.\n"}
                ,{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "reader-costume"
                 ,_2: "vampire"
                 ,_3: "\nYou leave the changing room with your fangs firmly in place and your cape trailing out behind you.\n\n\"Oh, no, Count!\" she exclaims. \"Please don\'t suck my blood. Think of the children... and take them first!\" She laughs wildly.\n"}
                ,{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "reader-costume"
                 ,_2: "godzilla"
                 ,_3: "\nYou barely get the costume into the changing room to begin with and get stuck in the door on the way out. Arlene is too busy laughing to comment.\n"}
                ,{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "reader-costume"
                 ,_2: "ugly-mask"
                 ,_3: "\nYou walk out of the changing room in your normal clothes -- well, normal except for the grotesquely deformed mask you are now wearing. Arlene looks at you quizzically for a moment.\n\n\"Are you not going to wear a costume? Why did you take off your mask?\" For a moment, she manages to keep her puzzled expression, but then she bursts into laughter.\n"}
                ,{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "reader-costume"
                 ,_2: "none"
                 ,_3: "\nYou walk out of the changing room again, unsure of why you bothered going in in the first place. It\'s not like you were actually changing. A moment passes, and you wonder if Arlene is going to be disappointed in you. However, when she sees you, she seems absolutely delighted.\n\n\"Goodness, Reader! You have chosen a truly terrifying costume. Where did you get that *mask*?\" She shudders dramatically before bursting into wild laughter.\n"}]),
   "");
   var block04 = A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nYou wander around the room, knowing there is no hope of looking through *every* costume in here. There are just far too many piled, hung, and boxed around the room. Still, you *should* pick something.\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Dress as a knight with a shining suit of armor and a sword."
                 ,_1: $Maybe.Just("reader-costume-picked")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.SetString,
                                                             "reader-costume",
                                                             "knight")])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Dress as a vampire with a flowing black cape, a suave popped collar, some slicked back hair, and a nice set of rather pointy chompers."
                 ,_1: $Maybe.Just("reader-costume-picked")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.SetString,
                                                             "reader-costume",
                                                             "vampire")])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Try to wear the Godzilla costume."
                 ,_1: $Maybe.Just("reader-costume-picked")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.SetString,
                                                             "reader-costume",
                                                             "godzilla")])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Put on that ugly, contorted mask in the corner that probably would have given you nightmares as a kid."
                 ,_1: $Maybe.Just("reader-costume-picked")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.SetString,
                                                             "reader-costume",
                                                             "ugly-mask")])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Don\'t wear a costume. You\'re too cool to dress up for Halloween."
                 ,_1: $Maybe.Just("reader-costume-picked")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.SetString,
                                                             "reader-costume",
                                                             "none")])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Nothing}]),
   true);
   var block02 = A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nThe walls are deep and lined with colorful costumes, some dainty, others strange, and others just plain gross, as Marissa may put it (endearingly, of course). Arlene hurries down the aisle of costumes plucking one out here, another there, picking one up and putting it back, then scooping another into her arms. When she returns to you, she has three costumes lined up.\n\n\"Oh, Reader, I can\'t decide? Which costume should I pick?\"\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Pick the witch costume with the black robe, pointy hat, and green witch\'s mask - big, warty nose included."
                 ,_1: $Maybe.Just("arlene-costume-picked")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.SetString,
                                                             "arlene-costume",
                                                             "witch")])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Pick the Fairy Godmother costume with the sparkly, blue dress, the star-shaped wand, and the grey wig."
                 ,_1: $Maybe.Just("arlene-costume-picked")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.SetString,
                                                             "arlene-costume",
                                                             "fairy-godmother")])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Pick the Gandalf costume with the grey wizard robe, giant staff, and flowing grey beard."
                 ,_1: $Maybe.Just("arlene-costume-picked")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.SetString,
                                                             "arlene-costume",
                                                             "gandalf")])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Nothing}]),
   true);
   var block01 = $InteractiveStory$StoryBlock.contentBlock("\nArlene stares at the portal, eyes wide and sparkling. Her fists are curled in front of her like a boxer preparing for a fight, and she is practically bouncing on the balls of her feet so that she looks just like a little kid eagerly awaiting a treat.\n\n\"Oh, this is so exciting!\" she exclaims, looking from you to the portal as if she doesn\'t know where to go next. \"Let\'s go pick out some costumes. Quickly!\"\n\nShe grabs you by the wrist so tightly it hurts just a little, and drags you off into the mansion behind her. The halls wind and twist, and at some point you go down a set of stairs. Finally, she pushes the door to a room open, flicks on the light, and rushes inside.\n");
   var conditionalTextChoiceBlock = F4(function (texts,
   $default,
   choices,
   showChosen) {
      return function (b) {
         return _U.replace([["contentGenerator"
                            ,A2($InteractiveStory$StoryBlock.conditionalTextBlock,
                            texts,
                            $default).contentGenerator]],
         b);
      }(A3($InteractiveStory$StoryBlock.choiceBlock,
      "",
      choices,
      showChosen));
   });
   var add = F2(function (field,
   amount) {
      return A2($InteractiveStory$Action.UpdateNum,
      field,
      function ($) {
         return $Maybe.Just(F2(function (x,
         y) {
            return x + y;
         })(amount)($Maybe.withDefault(0)($)));
      });
   });
   var isTrue = F2(function (key,
   vars) {
      return _U.eq(A2($Dict.get,
      key,
      vars.bool),
      $Maybe.Just(true));
   });
   var setVars = function (varSettings) {
      return $Basics.always(_U.replace([["variableEdits"
                                        ,varSettings]],
      $InteractiveStory$Action.emptyEffectSet));
   };
   var $goto = F2(function (l,b) {
      return _U.replace([["next"
                         ,$Basics.always($InteractiveStory$Action.Label(l))]],
      b);
   });
   var stopBGM = function (fo) {
      return $Basics.always(_U.replace([["soundUpdates"
                                        ,_L.fromArray([A2($InteractiveStory$Sound.StopLoop,
                                        $InteractiveStory$Sound.BGM,
                                        fo)])]],
      $InteractiveStory$Action.emptyEffectSet));
   };
   var bgm = F3(function (l,
   fi,
   fo) {
      return $Basics.always(_U.replace([["soundUpdates"
                                        ,_L.fromArray([A3($InteractiveStory$Sound.bgm,
                                        l,
                                        fi,
                                        fo)])]],
      $InteractiveStory$Action.emptyEffectSet));
   });
   var onLeave = F2(function (f,
   b) {
      return _U.replace([["onLeave"
                         ,f]],
      b);
   });
   var onEnter = F2(function (f,
   b) {
      return _U.replace([["onEnter"
                         ,f]],
      b);
   });
   var block09 = onEnter(A3(bgm,
   "portal-bgm",
   $Maybe.Nothing,
   $Maybe.Nothing))($InteractiveStory$StoryBlock.contentBlock("\n\"THREE!\"\n\nShe grabs your arm as she dives into the swirling mass of the portal, pulling you in alongside her. You tumble in head first, and the force of the portal hurls you onward so harshly that it feels as if it will turn you inside out. Streaks of purple and orange dart around you, flashing into existence in one instant, flitting playfully around your head, and blinking out into the blackness of the portal in the next. In the distance, you can see shooting stars, except the stars aren\'t moving at all. Galaxies fly past, and your ears pound with the utter, discordant loudness of the abyss as it pulls you through. You hear screaming and laughing and howling and growling, all fading in and out in a clashing choir of Halloween fun.\n\nYou turn to look for Arlene, and she is just barely ahead of you, tumbling and laughing, having the time of her life. A dark rift appears in the distance ahead and grows closer at an alarming rate. Through it, you can make out the dull grey pavement of a street, painted orange by the streetlights and perhaps a glowing jack-o-lantern. In just a moment, you will rocket out of the other end of the portal and crash into the hard ground. As the exit hurtles towards you, you envision yourself splattering against the pavement, and you have to close your eyes. Even without sight, you can feel the exit approaching, propelling you to your--\n"));
   var block10 = onEnter(stopBGM($Maybe.Just($InteractiveStory$Sound.reverseTransition(A3($InteractiveStory$Sound.fade,
   0,
   0.9,
   1500)))))($InteractiveStory$StoryBlock.contentBlock("You land safely on your feet."));
   var label = F2(function (l,b) {
      return _U.replace([["label"
                         ,$Maybe.Just(l)]],
      b);
   });
   var bundleOfFun = function (b) {
      return _U.replace([["next"
                         ,$Basics.always($InteractiveStory$Action.Stop)]],
      b);
   }(label("bundle-of-fun")($InteractiveStory$StoryBlock.contentBlock("\n### End\nWell, aren\'t you a bundle of fun? If you get bored while not trick or treating, perhaps you would like to refresh the page and start over... That or just [return to watching other people have fun](/).\n")));
   var block_pre_02 = label("invite-arlene")($InteractiveStory$StoryBlock.contentBlock("\nA weightiness comes over your body, and you find yourself quite tangible within the room again. This time, Arlene does hear your footsteps and turns to face you, smiling brightly, if not a bit distractedly.\n\n\"Oh, look who it is!\" she exclaims. \"Didn\'t manage to sneak up on me this time, now did you?\" A cackling laugh escapes her throat, and she reigns it back in. \"So to what do I owe this pleasure?\"\n\nYou ask her if she\'d like to go trick or treating with you.\n\n\"In your world, you mean? That sounds so exciting! I\'d love to! But how would we--\"\n\nAs if in answer to her question, a thin line slices through the air. For a moment, it hangs there, suspended in the air like a piece of silk, and then it begins to tear open. Air is sucked in with a *whoosh* as the tear in space grows wider, swirling with purple and red and orange and black. Through it, you can hear echoes of \"trick or treat,\" screaming and then laughter, and spooky music. You can hear Halloween.\n"));
   var block03 = label("arlene-costume-picked")($InteractiveStory$StoryBlock.contentBlock("\n\"A wonderful choice! Excuse me while I go change. You should pick a costume for yourself while I\'m gone!\"\n\nWith that she, vanishes into the changing room in the back that was previously hidden behind a towering Godzilla costume that might actually be made to scale.\n"));
   var block05 = label("reader-costume-picked")(A2($InteractiveStory$StoryBlock.conditionalTextBlock,
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "arlene-costume"
                 ,_2: "witch"
                 ,_3: "\nWhen Arlene comes out of the changing room, you hardly recognize her underneath the draping, black robe and the wart-ridden, sickly green mask in front of her face. Her red hair puffs out in the back and frames her head underneath the brim of her pointed hat.\n\n\"What are ye doin\' in the house of a witch, my pretty?\" She cackles menacingly, throwing her head back. \"Be gone with ye, quickly, into the changing room before I turn ye into a frog!\" Another round of laughter as you walk past her into the room in the back to get changed.\n"}
                ,{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "arlene-costume"
                 ,_2: "fairy-godmother"
                 ,_3: "\nArlene comes out of the changing room in a beautiful blue dress. In one hand, she daintily carries a wand between two fingers. In the other, she is draping a keychain of a pumpkin carriage that you\'re pretty sure did not actually come with the costume.\n\n\"Oh, my dear,\" she says, seeing you holding your costume. \"You\'re going to be late for the ball! Quickly, into pumpkin carriage!\" She tosses you the keychain. \"Off to the changing room, now. Tut, tut!\"\n\nAnd off you go, to change into your own costume before heading out.\n"}
                ,{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "arlene-costume"
                 ,_2: "gandalf"
                 ,_3: "\nArlene comes out of the changing room garbed in a grey cloak with a comedically luscious beard dangling off her face. In one hand, she holds a wooden staff. You make for the changing room yourself, but she steps in front of you.\n\n\"YOU SHALL NOT PASS!\" she exclaims, jabbing her staff loudly into the ground. \"Just kidding!\" She steps aside, smiling under the beard, which apparently tickles her nose because you hear her sneeze as you enter the changing room.\n  "}]),
   ""));
   var block12 = $goto("post-arlene-got-sick")(label("arlene-got-sick")($InteractiveStory$StoryBlock.contentBlock("\n  \"Oh, I\'m quite fine now. Though, we may wish to avoid a certain cop tonight. Don\'t worry, though. His uniform will be... hard to miss. Ahaha.\"\n  ")));
   var block13 = $goto("post-arlene-got-sick")(label("arlene-got-sick-2")($InteractiveStory$StoryBlock.contentBlock("\n  \"Oh, nothing, nothing! Though, we may wish to avoid a certain cop tonight. Don\'t worry, though. His uniform will be... hard to miss. Ahaha.\"\n")));
   var block14 = onLeave(A3(bgm,
   "trick-or-treat-bgm",
   $Maybe.Just(A3($InteractiveStory$Sound.fade,
   0,
   0.8,
   3000)),
   $Maybe.Nothing))(label("post-arlene-got-sick")($InteractiveStory$StoryBlock.contentBlock("\n  \"Anyway,\" she continues, \"let\'s *not* go through that portal again.\" She smiles and inhales deeply. The screams and laughter are closer now, all around you. Jack-o-lanterns are strewn about lawns and porches. Every other house seems to have styrofoam graves sunken into the lawn or skeletons hanging from the trees. Bushes are festooned with orange lights and puffy spider webs. \"It sure has been a while,\" Arlene says with a distinctly nostalgic note in her voice. \"Well, no use dilly-dallying. Let\'s go trick or treating!\"\n")));
   var block15 = function (b) {
      return _U.replace([["onEnter"
                         ,function (vars) {
                            return A2(setVars,
                            _L.fromArray([$InteractiveStory$Action.SetBool("done-with-everything")(A2($List.foldl,
                            F2(function (x,y) {
                               return x && y;
                            }),
                            true)(A2($List.map,
                            A2($Basics.flip,isTrue,vars),
                            _L.fromArray(["high-schoolers-gone"
                                         ,"done-with-kids"
                                         ,"done-with-old-lady"
                                         ,"visited-park"
                                         ,"visited-creepy-music-house"
                                         ,"visited-house-with-scarecrow"
                                         ,"visited-down-road"]))))]),
                            vars);
                         }]],
      b);
   }(onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
   "visited-intersection",
   true)])))(label("intersection-1")(A4(conditionalTextChoiceBlock,
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.bool;
                 }
                 ,_1: "done-with-everything"
                 ,_2: true
                 ,_3: "\nYou return to the T-shaped intersection with Arlene. She looks up and down all the streets and then back at you.\n\n\"Oh, dear. It seems there isn\'t much left to do. Perhaps it\'s about time to head back to the Party, wouldn\'t you say?\"\n\nLooking up and down the darkening streets as people shut their lights and less and less people pass by, you have to agree. It\'s about time to head home.\n\n\"That was quite fun, though, Reader! It\'s been a while since I went trick or treating, so thanks for taking me along!\"\n  "}
                ,{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.bool;
                 }
                 ,_1: "visited-intersection"
                 ,_2: true
                 ,_3: "\nYou return to the T-shaped intersection with Arlene.\n\n\"Lead the way, Reader!\"\n  "}]),
   "\nYou are in a T-shaped intersection. Ahead of you is possibly the most decorated street you have ever seen. Spooky music eminates from one of the houses down this way, and the road is absolutely flooded with trick or treaters, hustling and bustling about, crying \"trick or treat\" happily at every door they approach. The street to your right is much quieter, and you can make out a couple hushed sobs coming from that direction. Down the road to your left, it sounds like a couple of teens are snickering about something. Perhaps they are up to something mischievous.\n\nArlene looks up and down all three roads before turning to you. \"Hmm... so many choices. I wonder which way we should go first.\"\n  ",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Go straight ahead (to trick or treating)."
                 ,_1: $Maybe.Just("straight-ahead")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.UpdateNum,
                                                             "story-counter",
                                                             function ($) {
                                                                return $Maybe.Just($Maybe.withDefault(0)($Maybe.map(F2(function (x,
                                                                y) {
                                                                   return x + y;
                                                                })(1))($)));
                                                             })])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Just(function (vars) {
                    return !_U.eq(A2($Dict.get,
                    "visited-trick-or-treat",
                    vars.bool),
                    $Maybe.Just(true));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Return to trick or treating."
                 ,_1: $Maybe.Just("pick-a-house")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return _U.eq(A2($Dict.get,
                    "visited-trick-or-treat",
                    vars.bool),
                    $Maybe.Just(true)) && $Basics.not(A2(isTrue,
                    "done-with-everything",
                    vars));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Go to the right (to crying children)."
                 ,_1: $Maybe.Just("right-crying-children")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return !_U.eq(A2($Dict.get,
                    "talked-to-kids",
                    vars.bool),
                    $Maybe.Just(true));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Return to children."
                 ,_1: $Maybe.Just("talk-to-kids")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return _U.eq(A2($Dict.get,
                    "talked-to-kids",
                    vars.bool),
                    $Maybe.Just(true)) && !_U.eq(A2($Dict.get,
                    "done-with-kids",
                    vars.bool),
                    $Maybe.Just(true));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Go to the left (to snickering teens)."
                 ,_1: $Maybe.Just("left-bullies")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function ($) {
                    return $Basics.not(isTrue("visited-bullies")($));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Return to high schoolers."
                 ,_1: $Maybe.Just("high-schoolers-gone")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return A2(isTrue,
                    "visited-bullies",
                    vars) && $Basics.not(A2(isTrue,
                    "high-schoolers-gone",
                    vars));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Go home for the night."
                 ,_1: $Maybe.Just("go-home")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function ($) {
                    return $Basics.not($Maybe.withDefault(false)($Dict.get("done-with-everything")(function (_) {
                       return _.bool;
                    }($))));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Go home for the night."
                 ,_1: $Maybe.Just("go-home-confirmed")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function ($) {
                    return $Maybe.withDefault(false)($Dict.get("done-with-everything")(function (_) {
                       return _.bool;
                    }($)));
                 })}]),
   true))));
   var block16 = label("straight-ahead")($InteractiveStory$StoryBlock.contentBlock("\nYou go straight ahead and enter the bustle of enthusiastic trick or treaters. Children are running up and down the street, nimbly dodging around you as if you are no more than a lamp post or a fire hydrant. Arlene ogles at a couple well-decorated houses and screams in delight as a giant spider drops out of a tree at a group of kids as they approach a house. Then she takes off, dragging you down the road alongside her towards the source of some spooky music and witches\' cackles.\n"));
   var block17 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
   "visited-trick-or-treat",
   true)])))(label("pick-a-house")(A4(conditionalTextChoiceBlock,
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.bool;
                 }
                 ,_1: "visited-trick-or-treat"
                 ,_2: true
                 ,_3: "\nYou and Arlene return to the street and survey the houses you haven\'t visited yet.\n\n\"Where should we go next?\" she asks.\n  "}]),
   "\nYou follow the big-eyed Arlene down the street until she abruptly stops in front of you. If you weren\'t paying attention, you would have run right into her.\n\n\"Oh, my. All of these houses look so *interesting*. Well, most of them.\" She glances at an undecorated house with all the lights off, a little distastefully. \"Which one should we visit first?\"\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Go to the simple looking house with a single pumpkin sitting on the stoop."
                 ,_1: $Maybe.Just("old-lady-house")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return $Basics.not(_U.eq(A2($Dict.get,
                    "done-with-old-lady",
                    vars.bool),
                    $Maybe.Just(true))) && $Basics.not(_U.eq(A2($Dict.get,
                    "smashed-pumpkin",
                    vars.bool),
                    $Maybe.Just(true)));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Return to the elderly woman\'s house."
                 ,_1: $Maybe.Just("return-to-old-lady-house")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return $Basics.not(_U.eq(A2($Dict.get,
                    "done-with-old-lady",
                    vars.bool),
                    $Maybe.Just(true))) && _U.eq(A2($Dict.get,
                    "smashed-pumpkin",
                    vars.bool),
                    $Maybe.Just(true));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Go to the house with the scarecrow out front holding a bowl of candy."
                 ,_1: $Maybe.Just("house-with-scarecrow")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                                             "visited-house-with-scarecrow",
                                                             true)])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Just(function ($) {
                    return $Basics.not($Maybe.withDefault(false)($Dict.get("visited-house-with-scarecrow")(function (_) {
                       return _.bool;
                    }($))));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Go to the house with the creepy music blaring and the shadow of a ghoul projected on the side."
                 ,_1: $Maybe.Just("creepy-music-house")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                                             "visited-creepy-music-house",
                                                             true)])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Just(function ($) {
                    return $Basics.not($Maybe.withDefault(false)($Dict.get("visited-creepy-music-house")(function (_) {
                       return _.bool;
                    }($))));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Go to the house with all of the lights out and no decorations. Arlene doesn\'t seem particularly interested in this one."
                 ,_1: $Maybe.Just("dark-house")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return !_U.eq(A2($Dict.get,
                    "visited-boring-house",
                    vars.bool),
                    $Maybe.Just(true));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Return to the unlit house."
                 ,_1: $Maybe.Just("dark-house")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return _U.eq(A2($Dict.get,
                    "visited-boring-house",
                    vars.bool),
                    $Maybe.Just(true)) && !_U.eq(A2($Dict.get,
                    "visited-park",
                    vars.bool),
                    $Maybe.Just(true));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Return to the spooky park."
                 ,_1: $Maybe.Just("spooky-park")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return _U.eq(A2($Dict.get,
                    "visited-park",
                    vars.bool),
                    $Maybe.Just(true)) && (!_U.eq(A2($Dict.get,
                    "done-with-sonny-jim",
                    vars.bool),
                    $Maybe.Just(true)) || !_U.eq(A2($Dict.get,
                    "done-with-pumpkin-patch",
                    vars.bool),
                    $Maybe.Just(true)));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Continue down the road."
                 ,_1: $Maybe.Just("continue-down-road")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                 "visited-down-road",
                 true)])))
                 ,_3: $Maybe.Just(function (vars) {
                    return !_U.eq(A2($Dict.get,
                    "visited-down-road",
                    vars.bool),
                    $Maybe.Just(true));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Go back to intersection."
                 ,_1: $Maybe.Just("intersection-1")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}]),
   true)));
   var block18 = label("house-with-scarecrow")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nYou approach the house with the scarecrow. It is holding a bowl of candy in its lap with a sign that reads, \"Please take two. Happy Halloween!\" Perched menacingly above the bowl is a half-decayed zombie hand. You have an idea what\'ll happen if you reach in for the candy.\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Reach for the candy *(take two)*."
                 ,_1: $Maybe.Just("post-candy-bowl")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.SetString,
                                                                           "scarecrow-took-candy",
                                                                           "two")
                                                                           ,A2(add,
                                                                           "morality",
                                                                           1)
                                                                           ,A2(add,
                                                                           "candy",
                                                                           2)])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Reach for the candy *(take a handful)*"
                 ,_1: $Maybe.Just("post-candy-bowl")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.SetString,
                                                                           "scarecrow-took-candy",
                                                                           "handful")
                                                                           ,A2(add,
                                                                           "morality",
                                                                           -1)
                                                                           ,A2(add,
                                                                           "candy",
                                                                           10)])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "No way I\'m reaching into that. It\'ll spook me!"
                 ,_1: $Maybe.Just("post-candy-bowl")
                 ,_2: $Maybe.Just($Basics.always(_U.replace([["variableEdits"
                                                             ,_L.fromArray([A2($InteractiveStory$Action.SetString,
                                                             "scarecrow-took-candy",
                                                             "none")])]],
                 $InteractiveStory$Action.emptyEffectSet)))
                 ,_3: $Maybe.Nothing}]),
   true));
   var block19 = label("post-candy-bowl")($goto("pick-a-house")(A2($InteractiveStory$StoryBlock.conditionalTextBlock,
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "scarecrow-took-candy"
                 ,_2: "two"
                 ,_3: "\nYou tentatively poke your hand into the candy bowl. Your hand lands on a couple of pieces of candy below the hovering zombie fingers, and you pick up two. Just as you are about convinced nothing is going to happen, the zombie hand clamps down on yours with a terrible growl from a little speaker on the side of the bowl. You snatch your hand back with your two pieces of candy while Arlene cackles with delight.\n\n\"Goodness, you are so obedient, Reader!\" she says, moving towards the bowl herself. She digs her whole hand into the bowl and giggles as the undead claw grabs and growls at her. She pulls out an entire handful of candy and dumps it into her bag. Then she goes back for a second. \"They did say \'Take two\'.\" She smiles shamelessly.\n\nYou both head back to the street.\n  "}
                ,{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "scarecrow-took-candy"
                 ,_2: "handful"
                 ,_3: "\nYou dig your whole hand into the candy bowl, and the zombie fingers clamp down on your own with a terrible growl from a speaker on the side of the bowl. When it lets go, you pull out a whole handful of candy and dump it into your bag.\n\n\"My, my, Reader. Such a rebel. It says to please take two.\" She casts you a mischievous smile and digs her whole hand into the bowl, giggling when the undead claw grabs and growls at her. Then, she returns for another handful. \"There, that\'s two.\"\n\nYou both head back to the street.\n  "}
                ,{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "scarecrow-took-candy"
                 ,_2: "none"
                 ,_3: "\nYou totally wimp out because you\'re scared of a plastic hand.\n\n\"Oh, please,\" Arlene huffs. \"Don\'t be such a baby.\" She grins mischievously and digs her whole hand into the bowl, giggling when the undead claw grabs and growls at her. She even goes back for seconds. \"What? It *did* say to take two.\"\n\nYou both head back to the street.\n"}]),
   "")));
   var block20 = onLeave(setVars(_L.fromArray([A2(add,
   "candy",
   30)])))($goto("pick-a-house")(label("creepy-music-house")($InteractiveStory$StoryBlock.contentBlock("\nYou approach the house with the creepy music playing. It is surrounded by a rusted metal fence, and no sooner have you stepped into the yard than the gate slams shut behind you. A devilish laugh echoes from a bush nearby, and a dense fog begins to spread over the ground around your feet.\n\n\"They really went all out, huh?\" Arlene asks, entranced by the fog dancing around the base of the foam headstones.\n\nYou both follow the electric torch-lit path a little farther before a ghost dives out of a tree towards you and Arlene with a ghastly wail and grey ribbons trailing out behind it. Arlene feigns a scream and grabs you by the wrist. \"Run, Reader, before it gets us!\"\n\nShe dodges off the main path, dragging you with her onto the headstone littered lawn. As you catch your breath, a new sound comes from behind you. The grumbling roar of a chainsaw revving and finally starting up. You turn around with a gasp and see a towering masked figure behind you.\n\n\"Oh, no! He\'s going to dismember us!\" Arlene cries. \"Quickly, this way!\"\n\nThe masked man chases you both around the lawn, down the side of the house, into the surprisingly well-decorated backyard, and you finally lose him around the front of the house again.\n\n\"Woo,\" Arlene pants. \"I think we lost him.\" She beams at you. \"Shall we collect our surivors\' prize?\"\n\nShe drags you to the front door and knocks without waiting for an answer. A short man with a hump back, lumpy forehead, snaggletooth, and muddy brown cloak greets you. \"Ahh, I see you have survived ze trials,\" he says in a distinctly fake Transylvanian accent. \"I suppose you vish for a revard, of sorts?\"\n\n\"Yes, please!\" Arlene says.\n\n\"Very well,\" the man responds. If you asked him for his name, 9 out of 10 says he\'d respond with Igor. \"Here you are.\" He tosses a couple goodie bags to both you and Arlene. \"Now begone with you both, before I decide to use you in my... experiments.\" He laughs ominously.\n\nYou and Arlene head back to the street.\n"))));
   var block21 = label("old-lady-house")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nYou approach the house with the single pumpkin sitting on the stoop. As you get closer, you can see that not only is this pumpkin not carved, it has a shabbily drawn face on it. Though the face is smiling, the shakily drawn lines make it look almost creepy.\n\n\"Oh, dear. What a sorry pumpkin this is,\" Arlene says, surveying the thing. A devilish look passes over her face. \"Say, Reader, would you like to smash it in the street? It\'s been a while since I\'ve partook in some good, old-fashioned Halloween mischief.\"\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Yeah, let\'s smash it! It\'ll look better that way, honestly."
                 ,_1: $Maybe.Just("smashing-pumpkins")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                                       "smashed-pumpkin",
                                                       true)
                                                       ,A2(add,
                                                       "morality",
                                                       -7)])))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "No way! Someone decorated that. Well, kinda..."
                 ,_1: $Maybe.Just("not-smashing-pumkins")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                                       "smashed-pumpkin",
                                                       false)
                                                       ,A2(add,"morality",5)])))
                 ,_3: $Maybe.Nothing}]),
   true));
   var block22 = onLeave(setVars(_L.fromArray([A2(add,
   "candy",
   7)])))(label("not-smashing-pumkins")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\n\"Yeah, I guess you\'re right,\" Arlene says, a little abashed. \"Ahh well.\"\n\nShe walks up the steps past the pumpkin and knocks on the door. You wait for about 30 seconds before Arlene knocks again, harder this time.\n\n\"Jeez,\" she says. \"Their lights are on. Wonder what\'s taking so--\"\n\nThe door creaks open, and an elderly woman is standing in the door, hunched over a cane. Despite how much difficulty she seems to be having moving, she still somehow managed to paint sloppy whiskers on her face and put on some black cat ears and a tail.\n\n\"Hello, dears,\" she croaks with a smile. \"Happy Halloween!\"\n\n\"Happy Halloween!\" Arlene responds, cheerily.\n\n\"I\'m sorry it took me so long to answer the door. Takes a while for me to get around these days.\" The old woman sighs. \"It even took a lot just to draw a face on that pumpkin this year. My joints aren\'t quite what they used to be, you know. I do so wish I could carve it, like I used to. Ah, but I\'m rambling again. Here, let me get you kids some treats.\"\n\nShe teeters as she pivots and reaches for a nearby bowl of candy. Arlene looks at you and whispers, \"Thanks for not letting me smash that pumpkin. I would have felt *terrible*. Actually, do you think we could help this old black cat carve it?\"\n\nThe old lady turns around again and drops a couple pieces of candy into both of your bags, her hands shaking.\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "\"Excuse me, ma\'am. Would you like us to help you carve your pumpkin?\" *(carve pumpkin)*"
                 ,_1: $Maybe.Just("carve-pumpkin")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2(add,
                 "morality",
                 5)])))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "\"Thank you!\" *(just leave)*"
                 ,_1: $Maybe.Just("pick-a-house")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                 "done-with-old-lady",
                 true)])))
                 ,_3: $Maybe.Nothing}]),
   true)));
   var block23 = $goto("pick-a-house")(label("smashing-pumpkins")($InteractiveStory$StoryBlock.contentBlock("\nArlene picks up the pumpkin, and you follow her out into the street.\n\n\"Ready?\" she asks. \"One. Two. Three!\"\n\nShe hurls the pumpkin as high as she can into the air. It flies above your head in a swooping arch and crashes with a satisfying *splat* on the road. Orange pumpkin guts explode from the seams, and the poorly drawn face splits and shatters across the road. A couple nearby parents regard you rather unfavorably and lead their kids farther away.\n\n\"Oh, no!\" a reedy voice croaks from behind you. Looking back, you see an elderly woman standing in the doorway staring at the pumpkin you just smashed. You know, the one you stole from her house. \"Why would you do that,\" she asks. She doesn\'t sound angry, just sad and resigned. \"It was the only decoration I had...\"\n\nYou\'re not sure if she\'s talking to you or to herself at this point, but she turns around, one shaky hand resting heavily on her cane, and returns to her house. A couple minutes later, the lights go out.\n\n\"Guess she doesn\'t feel like having more visitors,\" Arlene says with an uncomfortable laugh. \"Actually, I feel kind of terrible now. Maybe we should get her another pumpkin.\"\n")));
   var block24 = label("return-to-old-lady-house")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nYou approach the old lady\'s house, glancing at the place her pumpkin used to be, and knock on the door. It takes a little while before anyone answers, but eventually she does make it to the door. It looks like she has unsuccessfully tried to wipe a set of painted whiskers off her face.\n\n\"What do you kids want from me now?\"\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Give her the pumpkin and apologize."
                 ,_1: $Maybe.Just("gave-pumpkin")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                                       "has-pumpkin",
                                                       false)
                                                       ,A2(add,"morality",5)])))
                 ,_3: $Maybe.Just(function (vars) {
                    return $Maybe.withDefault(false)($Dict.get("has-pumpkin")(vars.bool));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Apologize."
                 ,_1: $Maybe.Just("apologized")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                                       "apologized",
                                                       true)
                                                       ,A2(add,"morality",3)])))
                 ,_3: $Maybe.Just(function (vars) {
                    return !_U.eq(A2($Dict.get,
                    "apologized",
                    vars.bool),
                    $Maybe.Just(true));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Nothing. *(return to street)*"
                 ,_1: $Maybe.Just("pick-a-house")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}]),
   true));
   var block25 = $goto("pick-a-house")(label("apologized")($InteractiveStory$StoryBlock.contentBlock("\n\"We\'re really sorry about what we did to your pumpkin. I feel terrible about it,\" Arlene says. You apologize in suit.\n\nThe old lady regards both of you for a moment. \"Well, it\'s alright, I suppose,\" she finally says. \"I just wish you\'d thought about it *before* you did it. But thank you for the apology. Now if you\'ll excuse me, I would like to be alone, I think.\"\n\nShe hobbles back into her house and closes the door. You and Arlene return to the street.\n")));
   var block26 = label("gave-pumpkin")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\n\"We\'re really sorry about what we did to your pumpkin,\" Arlene says. \"But look!\" She pulls the new pumpkin out of your bag and holds it up for the elderly woman. \"We got you a new one!\"\n\nThe old woman\'s eyes light up, and she smiles so genuinely that you can\'t help but feel like you did something really great -- even though this was your fault in the first place.\n\n\"What a surprise! Thank you, dears,\" she says. \"It\'s lovely. Even better than the first.\" She looks from you to Arlene to the pumpkin. \"I don\'t suppose you\'d like to help an old woman carve it? My hands aren\'t quite what they used to be, I\'m afraid.\"\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "\"We\'d love to!\" *(carve pumpkin)*"
                 ,_1: $Maybe.Just("carve-pumpkin")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2(add,
                 "morality",
                 5)])))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "\"No thanks.\" *(return to street)*"
                 ,_1: $Maybe.Just("pick-a-house")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                 "done-with-old-lady",
                 true)])))
                 ,_3: $Maybe.Nothing}]),
   true));
   var block27 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
   "done-with-old-lady",
   true)])))($goto("pick-a-house")(label("carve-pumpkin")($InteractiveStory$StoryBlock.contentBlock("\nThe old woman is delighted that you want to carve the pumpkin with her, and you follow her into her house. The pace going from the door to the kitchen is slow as she hobbles in front of you, but you eventually make it to the kitchen table where you place the pumpkin down. She directs you to a cabinet with some markers and another with knives and spoons to carve the pumpkin and scoop out the guts. Together, you design a pretty awesome looking pumpkin, and you begin to carve it.\n\n\"Dear, it just occurred to me that I haven\'t yet introduced myself,\" the old woman says. \"My name is Lucille, but you can just call me Lucy. What are your names?\"\n\n\"I\'m Arlene,\" Arlene says, jabbing the knife into the pumpkin\'s face again and popping out an eye. \"And you can call my friend Reader.\" She gestures at you.\n\n\"Arlene and Rita. Such pretty names. You know, I knew a little girl once who wanted her name to be Arlene. She even went around telling people it *was* her real name. I lost track of her after her mother passed, unfortunately. But she was always such a sweet girl.\"\n\n\"Oh, my. I do hope she\'s alright,\" Arlene says, sounding a little surprised. \"Perhaps you\'ll meet her again someday.\"\n\n\"Perhaps,\" Lucy chuckles. \"My, the pumpkin looks lovely.\"\n\nYou pop the mouth out of the pumpkin and clean up around the edges.\n\n\"Now all it needs is a candle!\" Lucy gets to her feet with the help of her cane and shuffles across the kitchen. She fishes a candle and a match out of a nearby drawer, and Arlene helps her light it and place it inside the pumpkin.\n\nYou bring it outside where it flickers orange and smiles at the passing trick or treaters. Lucy is smiling too.\n\n\"Thank you, dears, for making this a wonderful Halloween,\" she says.\n\nYou and Arlene wish her well and head back to the street where you cast one final glance back at the pumpkin. It\'s not a masterwork, but it really brings some life to the house anyway.\n"))));
   var block28 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
   "visited-boring-house",
   true)])))(label("dark-house")(A4(conditionalTextChoiceBlock,
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.bool;
                 }
                 ,_1: "visited-boring-house"
                 ,_2: true
                 ,_3: "\nYou return to the unlit house and can hear growling somewhere around the back. Arlene seems to want to check it out.\n    "}]),
   "\nYou approach the boring, unlit house with Arlene dragging her feet behind you. She doesn\'t really want to visit this house since obviously no one is even home, but for some reason you insist. When you get to the door, you knock.\n\nNo one answers. I mean, what did you expect really? There aren\'t even cars in the driveway.\n\nYou turn around to leave, but before you get very far, you hear something growling in the distance. It sounds as if it\'s coming from somewhere behind the house. Arlene now looks quite interested.\n\n\"Perhaps coming here will be interesting after all!\"\n    ",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Turn back."
                 ,_1: $Maybe.Just("pick-a-house")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Investigate the growling."
                 ,_1: $Maybe.Just("dark-house-back-yard")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}]),
   true)));
   var block29 = label("dark-house-back-yard")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nYou walk around the back of the house with Arlene and follow the growling to a fence in the back yard. Beyond the fence, there seems to be some sort of creepy park. The growling is coming from in there somewhere.\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Turn back."
                 ,_1: $Maybe.Just("pick-a-house")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Hop the fence."
                 ,_1: $Maybe.Just("hop-the-fence")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                 "visited-park",
                 true)])))
                 ,_3: $Maybe.Nothing}]),
   true));
   var block30 = $goto("spooky-park")(label("hop-the-fence")(A2($InteractiveStory$StoryBlock.conditionalTextBlock,
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "reader-costume"
                 ,_2: "godzilla"
                 ,_3: "\nArlene hops the fence ahead of you, and you try to follow. However, since you decided to wear that ridiculously oversized Godzilla costume, you can\'t quite seem to make it over the fence. Eventually, Arlene gets tired of waiting and climbs back over to hoist you up. You barely clear the top of the fence and tumble over into the park. Embarrassing.\n\n\"Oh, my. Are you alright, Reader?\" Arlene asks, landing nimbly beside you. She grabs your hand and helps you off the ground.\n  "}]),
   "\nYou and Arlene hop the fence and land in a strange park.\n  ")));
   var block31 = label("spooky-park")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nThe park is incredibly dark, lit only by the twinkling stars and pale moonlight. The growling seems to be coming from just ahead, possibly behind a gnarled tree. Under the tree, you can make out a figure in the moonlight. It looks like... a corpse? If it weren\'t Halloween, that might be really freaky. To your right, you can see a pumpkin patch, though you can\'t imagine why that would be in a park to begin with.\n  ",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Investigate the corpse."
                 ,_1: $Maybe.Just("park-corpse")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return !_U.eq(A2($Dict.get,
                    "done-with-sonny-jim",
                    vars.bool),
                    $Maybe.Just(true));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Visit the pumpkin patch."
                 ,_1: $Maybe.Just("pumpkin-patch")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return !_U.eq(A2($Dict.get,
                    "done-with-pumpkin-patch",
                    vars.bool),
                    $Maybe.Just(true));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Turn back."
                 ,_1: $Maybe.Just("pick-a-house")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}]),
   true));
   var block32 = label("pumpkin-patch")(A4(conditionalTextChoiceBlock,
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.bool;
                 }
                 ,_1: "smashed-pumpkin"
                 ,_2: true
                 ,_3: "\nYou and Arlene head over to the pumpkin patch.\n\n\"How delightful!\" Arlene exclaims, dancing around the fat orange pumpkins. \"Oh, let\'s pick one for the old lady! We do kind of owe her a pumpkin, after all.\"\n  "}]),
   "\nYou and Arlene head over to the pumpkin patch.\n\n\"How delightful!\" Arlene exclaims, dancing around the fat orange pumpkins. \"I do love pumpkin picking. Shall we pick ourselves a pumpkin, then?\"\n    ",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Pick a pumpkin."
                 ,_1: $Maybe.Just("pumpkin-picked")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                                       "has-pumpkin",
                                                       true)
                                                       ,A2($InteractiveStory$Action.SetBool,
                                                       "done-with-pumpkin-patch",
                                                       true)])))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Leave pumpkin patch."
                 ,_1: $Maybe.Just("spooky-park")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}]),
   true));
   var block33 = label("park-corpse")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nYou and Arlene approach the corpse. It is indeed very realistic. And gruesome. It\'s face has been torn off.\n\nYou look up and see a big dog in front of you, growling and baring its gigantic, sharp teeth. It\'s wearing a name tag that says \"Sonny Jim\". Arlene finds this hilarious.\n\n\"Did some old geezer name this thing? \'Hey get off mah lawn Sonny Jim!\' She makes a whistling sound with her tongue on the \'S\' so it sounds like \"Shunny\". The dog gets closer, still growling.\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Pet the dog. It\'s clearly friendly."
                 ,_1: $Maybe.Just("game-over")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                                       "done-with-sonny-jim",
                                                       true)
                                                       ,A2($InteractiveStory$Action.SetString,
                                                       "game-over-text",
                                                       "Congratulations. Sonny Jim ripped your face off.")
                                                       ,A2($InteractiveStory$Action.SetString,
                                                       "game-over-text-2",
                                                       "But you died. So there\'s that. And it wasn\'t even at the Party, so you don\'t get to tell a story. You just get to be dead. Woohoo?")])))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Run for your life!"
                 ,_1: $Maybe.Just("run-from-sonny-jim")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                 "done-with-sonny-jim",
                 true)])))
                 ,_3: $Maybe.Nothing}]),
   true));
   var block34 = label("run-from-sonny-jim")(function (b) {
      return _U.replace([["next"
                         ,function (vars) {
                            return _U.eq(A2($Dict.get,
                            "reader-costume",
                            vars.string),
                            $Maybe.Just("godzilla")) ? $InteractiveStory$Action.Label("game-over") : $InteractiveStory$Action.Label("pick-a-house");
                         }]
                        ,["onLeave"
                         ,function (vars) {
                            return _U.eq(A2($Dict.get,
                            "reader-costume",
                            vars.string),
                            $Maybe.Just("godzilla")) ? _U.replace([["variableEdits"
                                                                   ,_L.fromArray([A2($InteractiveStory$Action.SetString,
                                                                                 "game-over-text",
                                                                                 "Congratulations. Sonny Jim ripped your face off.")
                                                                                 ,A2($InteractiveStory$Action.SetString,
                                                                                 "game-over-text-2",
                                                                                 "But you died. So there\'s that. And it wasn\'t even at the Party, so you don\'t get to tell a story. You just get to be dead. Woohoo?")])]],
                            $InteractiveStory$Action.emptyEffectSet) : $InteractiveStory$Action.emptyEffectSet;
                         }]],
      b);
   }(A2($InteractiveStory$StoryBlock.conditionalTextBlock,
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "reader-costume"
                 ,_2: "godzilla"
                 ,_3: "\nYou and Arlene turn tail and try to escape Sonny Jim, but the big dog is fast and is gaining on you quickly, drool slobbering out of its mouth as it barks at you. Arlene laughs, screaming \"Catch me if you can, puppy!\" After running the Midnight Murder Party, she doesn\'t seem too fazed by the idea of being torn apart. You, on the other hand...\n\nYou two arrive at the fence to the park, and Arlene hops over no problem. You, however, forgot that you chose the most unwieldy costume ever and now realize that you can\'t make it over the fence. Sonny Jim pounces.\n    "}]),
   "\nYou and Arlene turn tail and try to escape Sonny Jim, but the big dog is fast and is gaining on you quickly, drool slobbering out of its mouth as it barks at you. Arlene laughs, screaming \"Catch me if you can, puppy!\" After running the Midnight Murder Party, she doesn\'t seem too fazed by the idea of being torn apart. You, on the other hand...\n\nYou two arrive at the fence to the park and hop over. Sonny Jim is left barking at you from the other side. You return to the street.\n  ")));
   var block35 = $goto("spooky-park")(label("pumpkin-picked")($InteractiveStory$StoryBlock.contentBlock("\nArlene searches the pumpkin patch, picking up pumpkins and examining them in hopes of finding the perfect one. Finally, she settles on a plump, nicely rounded pumpkin hidden in the back of the patch and stuffs it in your bag.\n\n\"Pumpkin in the pumkin bag!\" she sings. You two leave the pumpkin patch.\n")));
   var gameover = function (b) {
      return _U.replace([["next"
                         ,$Basics.always($InteractiveStory$Action.Stop)]
                        ,["onEnter"
                         ,function (vars) {
                            return _U.replace([["variableEdits"
                                               ,function () {
                                                  var gameovertext2 = $InteractiveStory$Action.SetString("game-over-text-2")($Maybe.withDefault("")(A2($Dict.get,
                                                  "game-over-text-2",
                                                  vars.string)));
                                                  var gameovertext = $InteractiveStory$Action.SetString("game-over-text")($Maybe.withDefault("")(A2($Dict.get,
                                                  "game-over-text",
                                                  vars.string)));
                                                  var candy = $InteractiveStory$Action.SetNum("candy")($Maybe.withDefault(0)(A2($Dict.get,
                                                  "candy",
                                                  vars.num)));
                                                  var morality = $Maybe.withDefault(0)(A2($Dict.get,
                                                  "morality",
                                                  vars.num));
                                                  var behavior = $InteractiveStory$Action.SetString("behavior")(_U.cmp(morality,
                                                  -5) > 0 && _U.cmp(morality,
                                                  5) < 0 ? "a pretty okay person" : _U.cmp(morality,
                                                  5) > -1 && _U.cmp(morality,
                                                  15) < 0 ? "a good person" : _U.cmp(morality,
                                                  15) > -1 ? "a fantastic rolemodel for society" : _U.cmp(morality,
                                                  -5) < 1 && _U.cmp(morality,
                                                  -10) > 0 ? "a bit of a prankster" : _U.cmp(morality,
                                                  -10) < 1 && _U.cmp(morality,
                                                  -20) > 0 ? "extremely mischievous. Actually, you might owe some people apologies... Yeah..." : _U.cmp(morality,
                                                  -20) < 1 ? "a horrible person" : _U.badIf($moduleName,
                                                  "between lines 710 and 715"));
                                                  return _L.fromArray([behavior
                                                                      ,candy
                                                                      ,gameovertext
                                                                      ,gameovertext2]);
                                               }()]],
                            $InteractiveStory$Action.emptyEffectSet);
                         }]],
      b);
   }(label("game-over")($InteractiveStory$StoryBlock.contentBlock("\n### End\n\n{{game-over-text}}\n\nWhile trick or treating, you collected {{candy}} pieces of candy and were {{behavior}}.\n\n{{game-over-text-2}}\n\nIf you want to hang out with Arlene some more, why not [head back to the Midnight Murder Party](/read.html)?\n\nOr, if you want to try again, just refresh the page.\n")));
   var block36 = function (b) {
      return _U.replace([["next"
                         ,function (vars) {
                            return !_U.eq(A2($Dict.get,
                            "visited-bullies",
                            vars.bool),
                            $Maybe.Just(true)) ? $InteractiveStory$Action.Label("bully-snatches-candy") : $InteractiveStory$Action.Label("pick-a-house");
                         }]],
      b);
   }(onLeave(setVars(_L.fromArray([A2(add,
   "candy",
   200)])))(label("continue-down-road")($InteractiveStory$StoryBlock.contentBlock("\nYou continue walking down the street, stopping at various houses along the way and collecting plenty of candy. But the farther you get down the road, the less the houses seem to be decorated. Eventually, Arlene suggests that you head back to the fun part of the street, and you agree.\n\nYou turn back.\n"))));
   var block37 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                              "bully-snatched-candy",
                                              true)
                                              ,A2(add,
                                              "candy",
                                              -15)])))(label("bully-snatches-candy")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nBut before you get very far, a teen runs by, digs his hands into both your bag and Arlene\'s simultaneously, and snatches out huge handfuls of candy. By all rights, it was rather an impressive motion, but...\n\n\"Hey!\" Arlene shouts. \"That brat just stole our candy!\"\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Chase him."
                 ,_1: $Maybe.Just("chase-bully")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                 "chased-bully",
                 true)])))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Let him go."
                 ,_1: $Maybe.Just("let-bully-go")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                 "let-bully-go",
                 true)])))
                 ,_3: $Maybe.Nothing}]),
   true)));
   var block38 = onLeave(setVars(_L.fromArray([A2(add,
   "candy",
   15)])))($goto("pick-a-house")(label("chase-bully")($InteractiveStory$StoryBlock.contentBlock("\n\"Get back here you little punk!\" Arlene yells, bolting down the street after him. She is surprisingly fast, and you can barely keep up. You two chase him down the block, through someone\'s yard, and manage to catch up with him as he rounds the corner. Arlene grabs his shoulder and yanks it back, sending the kid sprawling to the ground.\n\n\"What\'s your problem?\" The teen spits. He must be at least seventeen and his expression is infuriatingly smug. Arlene looks at him like he\'s an idiot.\n\n\"What do *you* think. Drop it,\" she says, none too kindly.\n\nThe teen\'s expression falters. \"Y-yeah? Make me.\"\n\nArlene sighs. \"Well, if you insist...\" She grabs his wrist and twists it behind his back.\n\n\"Ow, ow, ow! Let go of me! I\'ll give you the stupid candy.\"\n\n\"Oh, goodie!\" Arlene says, releasing his arm and clapping her hands together.\n\nThe teen picks up some of the dropped candy from the ground and returns it to your bags, hesitantly glancing at Arlene as he does so. But she seems quite content again. Once the candy is all back where it belongs, he makes to leave, then pauses. \"Uh... so, can I go?\"\n\n\"Yes, indeed. Hopefully we won\'t have any more trouble tonight, okay?\"\n\n\"Y-yeah,\" he responds. With one final glance back, he takes off down the road.\n\nWhen he is out of sight, Arlene turns to you. \"Phew... I forgot how tiring acting tough was.\" She chuckles and says, \"Well, in any case, back to trick or treating!\"\n"))));
   var block39 = $goto("pick-a-house")(label("let-bully-go")($InteractiveStory$StoryBlock.contentBlock("\n\"Get back here you little punk!\" Arlene yells. But before she can chase after him, you put a hand on her shoulder and ask her to just let it go. She pouts petulantly but agrees.\n")));
   var block40 = label("right-crying-children")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nYou head down the street to your right. Just ahead, there is a group of kids sitting on the curb. One or two of them are crying.\n\n\"I wonder what\'s happened to them,\" Arlene ponders. \"I do hope they\'re alright.\"\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Approach the crying children."
                 ,_1: $Maybe.Just("talk-to-kids")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Go back to intersection. You\'re sure they\'re fine."
                 ,_1: $Maybe.Just("intersection-1")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}]),
   true));
   var block41 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
   "talked-to-kids",
   true)])))(label("talk-to-kids")(A4(conditionalTextChoiceBlock,
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.bool;
                 }
                 ,_1: "talked-to-kids"
                 ,_2: true
                 ,_3: "\nYou head down the street to your right and walk up to the sad-looking children. They look up at you hopefully. \"Have you found our candy?\" the girl asks.\n  "}
                ,{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.bool;
                 }
                 ,_1: "has-candy"
                 ,_2: true
                 ,_3: "\nYou approach the sniffling children and ask what\'s wrong. A brown-haired girl who appears to be comforting her little brother looks up at you mistrustfully.\n\n\"What do you want? We don\'t have any candy left, if you\'re trying to steal it too.\"\n\n\"Someone stole your candy? It didn\'t happen to be a bunch of high schoolers, did it?\" Arlene asks, glancing back towards where you met the bullies.\n\n\"Y-yeah,\" the younger boy sniffles. \"It was a bunch of stupid-face big kids. We worked really hard getting that candy...\"\n\nAnother kid, who has been quietly staring at you two in awe, speaks up. \"So... t-they went that way... I think.\" He points back towards the intersection.\n\n\"I see,\" Arlene says. \"We had a bit of a run in with them ourselves. Those guys were jerks.\"\n\n\"Yeah, you said it!\" the brown-haired girl agrees.\n"}
                ,{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.bool;
                 }
                 ,_1: "high-schoolers-gone"
                 ,_2: true
                 ,_3: "\nYou approach the sniffling children and ask what\'s wrong. A brown-haired girl who appears to be comforting her little brother looks up at you mistrustfully.\n\n\"What do you want? We don\'t have any candy left, if you\'re trying to steal it too.\"\n\n\"Someone stole your candy?\" Arlene asks, taken aback.\n\n\"Y-yeah,\" the younger boy sniffles. \"It was a bunch of stupid-face big kids. We worked really hard getting that candy...\"\n\nAnother kid, who has been quietly staring at you two in awe, speaks up. \"So... t-they went that way... I think.\" He points back towards the intersection.\n\n\"Oh.\" Arlene says. \"Ahaha. I think we ran into them earlier, but... we kind of lost track of them. Sorry.\"\n\n\"That\'s alright,\" the brown-haired girl says. She sounds rather disappointed. \"Well, thanks anyways.\" She looks at her brother. \"Stop moping, dummy. If we go now, we can still get some candy.\"\n    "}]),
   "\nYou approach the sniffling children and ask what\'s wrong. A brown-haired girl who appears to be comforting her little brother looks up at you mistrustfully.\n\n\"What do you want? We don\'t have any candy left, if you\'re trying to steal it too.\"\n\n\"Someone stole your candy?\" Arlene asks, taken aback.\n\n\"Y-yeah,\" the younger boy sniffles. \"It was a bunch of stupid-face big kids. We worked really hard getting that candy...\"\n\nAnother kid, who has been quietly staring at you two in awe, speaks up. \"So... t-they went that way... I think.\" He points back towards the intersection.\n\n\"Perhaps we could retrieve your candy,\" Arlene says.\n\nThe sniffling kid looks up at her hopefully. \"W-would you really?\"\n\n\"Yup! We\'ll keep an eye out!\"\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Give candy."
                 ,_1: $Maybe.Just("return-childrens-candy")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2(add,
                                                       "morality",
                                                       5)
                                                       ,A2(add,"candy",12)
                                                       ,A2($InteractiveStory$Action.SetBool,
                                                       "has-candy",
                                                       false)])))
                 ,_3: $Maybe.Just(function (vars) {
                    return _U.eq(A2($Dict.get,
                    "has-candy",
                    vars.bool),
                    $Maybe.Just(true));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Give them some of your own candy."
                 ,_1: $Maybe.Just("give-some-candy")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2(add,
                                                       "morality",
                                                       6)
                                                       ,A2($InteractiveStory$Action.UpdateNum,
                                                       "candy",
                                                       $Maybe.map(function (n) {
                                                          return _U.cmp(n - 100,
                                                          0) < 0 ? 0 : n - 100;
                                                       }))])))
                 ,_3: $Maybe.Just(function (vars) {
                    return A2(isTrue,
                    "high-schoolers-gone",
                    vars) && (_U.cmp($Maybe.withDefault(0)(A2($Dict.get,
                    "candy",
                    vars.num)),
                    0) > 0 && $Basics.not(A2(isTrue,
                    "has-candy",
                    vars)));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Return to intersection."
                 ,_1: $Maybe.Just("intersection-1")
                 ,_2: $Maybe.Just(function (vars) {
                    return A2(isTrue,
                    "high-schoolers-gone",
                    vars) && $Basics.not(A2(isTrue,
                    "has-candy",
                    vars)) ? A2(setVars,
                    _L.fromArray([A2($InteractiveStory$Action.SetBool,
                    "done-with-kids",
                    true)]),
                    vars) : A2(setVars,
                    _L.fromArray([]),
                    vars);
                 })
                 ,_3: $Maybe.Just(function (vars) {
                    return A2(isTrue,
                    "has-candy",
                    vars) || !_U.eq(A2($Dict.get,
                    "talked-to-kids",
                    vars.bool),
                    $Maybe.Just(true));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "\"Sorry, not yet.\""
                 ,_1: $Maybe.Just("intersection-1")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return _U.eq(A2($Dict.get,
                    "talked-to-kids",
                    vars.bool),
                    $Maybe.Just(true)) && $Basics.not(A2(isTrue,
                    "high-schoolers-gone",
                    vars));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "\"About that...\""
                 ,_1: $Maybe.Just("we-lost-them")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return A2(isTrue,
                    "talked-to-kids",
                    vars) && (A2(isTrue,
                    "high-schoolers-gone",
                    vars) && $Basics.not(A2(isTrue,
                    "has-candy",
                    vars)));
                 })}]),
   true)));
   var block42_3 = label("we-lost-them")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nYou tell the kids that you think you found the high schoolers who took it, but you... well... kind of lost track of them.\n\n\"Ahaha, yeah. Sorry about that.\" Arlene says.\n\n\"That\'s alright,\" the brown-haired girl says. She sounds rather disappointed. \"Well, thanks anyways.\" She looks at her brother. \"Stop moping, dummy. If we go now, we can still get some candy.\"\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Give them some of your own candy."
                 ,_1: $Maybe.Just("give-some-candy")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2(add,
                                                       "morality",
                                                       6)
                                                       ,A2($InteractiveStory$Action.UpdateNum,
                                                       "candy",
                                                       $Maybe.map(function (n) {
                                                          return _U.cmp(n - 100,
                                                          0) < 0 ? 0 : n - 100;
                                                       }))])))
                 ,_3: $Maybe.Just(function (vars) {
                    return _U.cmp($Maybe.withDefault(0)(A2($Dict.get,
                    "candy",
                    vars.num)),
                    0) > 0;
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Return to intersection."
                 ,_1: $Maybe.Just("intersection-1")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                 "done-with-kids",
                 true)])))
                 ,_3: $Maybe.Nothing}]),
   true));
   var block42 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
   "done-with-kids",
   true)])))($goto("intersection-1")(label("return-childrens-candy")($InteractiveStory$StoryBlock.contentBlock("\n\"Look what we found!\" Arlene sings, holding up several bags of candy before the children.\n\n\"Our candy!\" The sniffling boy yells, jumping from the curb. \"Thank you, miss!\"\n\n\"Yeah, thanks a bunch,\" his older sister says, smiling.\n\nThe quiet kid nods appreciatively but says nothing.\n\n\"Our pleasure,\" Arlene says. She bows theatrically and hands the bags off to the kids.\n\n\"Here,\" the brown-haired girl says, extending a fistful of candy and dumping it into Arlene\'s bag and then dumping a handful into yours as well. \"That\'s for being really cool!\"\n\n\"Why, thank you!\" Arlene says, surprised by the gift. \"I hardly require compensation, but who can turn down candy?\" She tips the girl a wink, and the younger girl giggles.\n\nThe kids say goodbye and run off down the street to continue trick or treating.\n"))));
   var block42_2 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
   "done-with-kids",
   true)])))($goto("intersection-1")(label("give-some-candy")($InteractiveStory$StoryBlock.contentBlock("\nYou and Arlene both offer them some of your candy, which they accept happily.\n\n\"Thanks a bunch!\" the brown-haired girl says, beaming.\n\n\"Yeah, thanks!\" her younger brother yells, wiping the tears from his face.\n\nThe quiet kid nodes appreciatively but says nothing.\n\n\"Our pleasure,\" Arlene says. She bows theatrically. The kids run off down the block.\n"))));
   var block43 = label("left-bullies")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nYou walk down the street to the left and see a group of teens up ahead. They are sitting on a curb, covered in shaving cream and snickering between mouthfuls of candy. None of them appear to be wearing costume, but they have three childish looking trick-or-treat bags between them. You get the feeling the bags aren\'t theirs.\n\n\"These kids look like trouble,\" Arlene says, grinning. \"Shall we see what they\'re up to?\"\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Check it out."
                 ,_1: $Maybe.Just("approach-bullies")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "No way! I don\'t mix with that type..."
                 ,_1: $Maybe.Just("intersection-1")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}]),
   true));
   var block44 = function (b) {
      return onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
      "visited-bullies",
      true)])))(label("approach-bullies")(_U.replace([["contentGenerator"
                                                      ,F3(function (_v0,
                                                      vars,
                                                      _v1) {
                                                         return function () {
                                                            return function () {
                                                               return function () {
                                                                  var bullyOffer = A2(isTrue,
                                                                  "talked-to-kids",
                                                                  vars) ? A2($Basics._op["++"],
                                                                  block44_2,
                                                                  block44_2_1) : block44_2;
                                                                  var arleneWhisper = A2(isTrue,
                                                                  "talked-to-kids",
                                                                  vars) ? block44_3 : block44_4;
                                                                  var secondaryResponse = A2(isTrue,
                                                                  "bully-snatched-candy",
                                                                  vars) ? A2(isTrue,
                                                                  "chased-bully",
                                                                  vars) ? bullyOffer : arleneWhisper : A2(isTrue,
                                                                  "talked-to-kids",
                                                                  vars) ? block44_5 : block44_6;
                                                                  return $Markdown.toHtml(A2($Basics._op["++"],
                                                                  block44_1,
                                                                  secondaryResponse));
                                                               }();
                                                            }();
                                                         }();
                                                      })]],
      b)));
   }(A3($InteractiveStory$StoryBlock.choiceBlock,
   "",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Take back kids\' candy."
                 ,_1: $Maybe.Just("take-back-candy")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function (vars) {
                    return A2(isTrue,
                    "talked-to-kids",
                    vars) && A2(isTrue,
                    "chased-bully",
                    vars);
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "\"Correct\" the situation. *(take back candy)*"
                 ,_1: $Maybe.Just("correct-the-situation")
                 ,_2: $Maybe.Just(function (vars) {
                    return A2(isTrue,
                    "let-bully-go",
                    vars) ? A2(setVars,
                    _L.fromArray([A2($InteractiveStory$Action.SetString,
                                 "bully-ditches-your-candy",
                                 "")
                                 ,A2($InteractiveStory$Action.SetString,
                                 "bully-ditches-your-candy",
                                 "The kid who stole your candy even yanks it out of his pocket and throws it at the ground in front of him.")]),
                    vars) : A2(setVars,
                    _L.fromArray([A2($InteractiveStory$Action.SetString,
                    "bully-ditches-your-candy",
                    "")]),
                    vars);
                 })
                 ,_3: $Maybe.Just(function (vars) {
                    return A2(isTrue,
                    "talked-to-kids",
                    vars) && $Basics.not(A2(isTrue,
                    "chased-bully",
                    vars));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Egg the school."
                 ,_1: $Maybe.Just("egg-the-school")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2(add,
                 "morality",
                 -6)])))
                 ,_3: $Maybe.Just(function (vars) {
                    return A2(isTrue,
                    "chased-bully",
                    vars) || $Basics.not(A2(isTrue,
                    "talked-to-kids",
                    vars)) && $Basics.not(A2(isTrue,
                    "bully-snatched-candy",
                    vars));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Confront them about their potentially stolen candy."
                 ,_1: $Maybe.Just("take-back-candy")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function ($) {
                    return $Basics.not(isTrue("talked-to-kids")($));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Leave. *(They might not be here when you get back. They have important... high schooler things to do.)*"
                 ,_1: $Maybe.Just("intersection-1")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}]),
   true));
   var block45 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
   "high-schoolers-gone",
   true)])))($goto("intersection-1")(label("high-schoolers-gone")($InteractiveStory$StoryBlock.contentBlock("\nYou return to the area where the high schoolers were hanging out, but there\'s no one here. Strange that they wouldn\'t sit around and wait for a total stranger to come back.\n"))));
   var block46 = label("take-back-candy")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\n\"Well,\" Arlene says, drawing out the word in a way that suggests she has an ultimatum coming up. \"Egging the school *does* sound like fun, but I have one teensy little concern.\" She pinches her forefinger and thumb together as she says \"teensy.\"\n\nHenry raises an eyebrow. \"Oh yeah, and what might that be?\"\n\n\"Those bags of candy.\" She nods towards the colorful trick or treat bags. \"They don\'t quite fit your image. They wouldn\'t happen to be stolen by any chance, would they?\"\n\n\"Ha! Look at this, boys,\" Henry says, raising and open palm towards Arlene. \"We got a regular detective here.\" The group chortles, and Henry returns his gaze to Arlene. \"As a matter of fact, we nabbed \'em from a couple of brats down the street. What of it?\"\n\n\"Oh, nothing much. I\'m afraid I just wouldn\'t feel right galavanting with a bunch of candy stealing bullies.\"\n\n\"What did you call us?\" Henry growls. Somehow, he doesn\'t seem to think stealing candy from \"a couple brats\" counts as being a bully.\n\n\"Oh, I apologize if I was unclear,\" Arlene says. Her smile gives away how much she is enjoying getting under Henry\'s skin. \"I called you bullies. Now, if you would kindly return that candy...\"\n\n\"SHUT UP!\" Henry thunders. \"I thought you were cool, but clearly you\'re both little twerps just like those kids.\" He looks to his posse. \"Let\'s show \'em not to mess with us, boys!\" There is a roar of agreement, and now a group of high school seniors are charging at you and Arlene.\n\n5 v 2. Seems fair.\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Stay and fight."
                 ,_1: $Maybe.Just("stay-and-fight")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Run like a wimp."
                 ,_1: $Maybe.Just("run-from-fight")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}]),
   true));
   var block47 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                              "has-candy",
                                              true)
                                              ,A2($InteractiveStory$Action.SetBool,
                                              "high-schoolers-gone",
                                              true)])))($goto("intersection-1")(label("stay-and-fight")(A2($InteractiveStory$StoryBlock.conditionalTextBlock,
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.bool;
                 }
                 ,_1: "chased-bully"
                 ,_2: true
                 ,_3: "\nYour plan is to take the three on the left and give Henry and the punk you chased down to Arlene, but things don\'t go quite as you planned. In fact, they go much better. The punk you chased down wimps out and flees as soon he sees you and Arlene aren\'t afraid of the fight. So, it turns into a 4 v 2.\n\nA fist flies towards your face and you barely dodge to the side, your leg still extended so the bully trips over it and stumbles past you. Then the other one is oncoming. He gets a shot in at your ribs, but entirely fails to protect the spot you were aiming for. This happens to be his face, and he topples to the ground, out cold. Nice hook!\n\nNext to you, Arlene seems to be having no trouble with Henry and the other one. In fact, she is laughing too hard to actually hit them. Henry\'s face is burning red as he swings at Arlene again. But his buddy goes in for Arlene at the same moment and takes Henry\'s fist to the back of his head. He stumbles back dazed.\n\nThe bully that stumbled behind you grabs you in a chokehold as you are watching Arlene. Maybe you should be paying more attention? But that\'s okay because Arlene is paying attention. She ducks another of Henry\'s frenzied punches and shoves him backwards. He slams into a tree and proceeds to start crying. Not so tough now.\n\nSeeing Henry downed, the guy holding onto your neck lets go and runs to get Henry up. It looks like the fight is over.\n\n\"I\'ll be taking these,\" Arlene says, as she scoops up the candy bags. \"Well, wasn\'t that fun?\" she says to you. \"Here, hold on to the candy.\" She hands you the children\'s candy.\n\nYou leave the dazed bullies in the intersection.\n  "}]),
   "\nThe odds look pretty bad as five high school seniors charge at you, but these daunting odds don\'t seem to faze Arlene. She catches the frontmost one in the nose with an oddly powerful left hook. He staggers backwards, both hands on his bleeding nose, and flees the fight almost immediately. What a wimp.\n\nA fist flies towards your face and you barely dodge to the side, your leg still extended so the bully trips over it and stumbles past you. Then the other one is oncoming. He gets a shot in at your ribs, but entirely fails to protect the spot you were aiming for. This happens to be his face, and he topples to the ground, out cold. Nice punch!\n\nNext to you, Arlene seems to be having no trouble with Henry and the other one. In fact, she is laughing too hard to actually hit them. Henry\'s face is burning red as he swings at Arlene again. But his buddy goes in for Arlene at the same moment and takes Henry\'s fist to the back of his head. He stumbles back dazed.\n\nThe bully that stumbled behind you grabs you in a chokehold as you are watching Arlene. Maybe you should be paying more attention? But that\'s okay because Arlene is paying attention. She ducks another of Henry\'s frenzied punches and shoves him backwards. He slams into a tree and proceeds to start crying. Not so tough now.\n\nSeeing Henry downed, the guy holding onto your neck lets go and runs to get Henry up. It looks like the fight is over.\n\n\"I\'ll be taking these,\" Arlene says, as she scoops up the candy bags. \"Well, wasn\'t that fun?\" she says to you. \"Here, hold on to the candy.\" She hands you the children\'s candy.\n\nYou leave the dazed bullies in the intersection.\n"))));
   var block48 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                              "has-candy",
                                              false)
                                              ,A2($InteractiveStory$Action.SetBool,
                                              "high-schoolers-gone",
                                              true)])))($goto("intersection-1")(label("run-from-fight")($InteractiveStory$StoryBlock.contentBlock("\nAs soon as the going gets rough, you flee the fight. Arlene looks from you to the charging bullies, distressed. After a moment, she turns around and catches up with you. The bullies are too busy laughing and jeering to bother chasing.\n\n\"Aww, come on!\" Arlene complains, when you stop a safe distance away. \"We totally could have taken them.\"\n\nYou remind her that it was five of them versus only you two, but that doesn\'t change Arlene\'s opinion.\n\n\"Well, I guess we won\'t be able to get that candy back,\" Arlene sighs.\n"))));
   var block49 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                              "has-candy",
                                              true)
                                              ,A2($InteractiveStory$Action.SetBool,
                                              "high-schoolers-gone",
                                              true)])))($goto("intersection-1")(label("correct-the-situation")($InteractiveStory$StoryBlock.contentBlock("\n\"Pardon me,\" Arlene says, cutting off the high schoolers\' laughter. \"Sorry to interrupt that raucous noise you\'re making, but I believe you have some candy that doesn\'t belong to you.\"\n\n\"Is that so?\" Henry asks, threateningly. \"And what do you propose we do with that candy, sweetcheeks?\"\n\n\"Well,\" Arlene says irritably, \"I *was* going to suggest simply returning it, but I am quite tired of listening to your nicknames for me. I think I\'d rather punch that ugly mouth they keep spewing out of.\" Before anyone has a moment to react, Arlene closes in on Henry and catches him in the mouth with an unexpectedly strong left hook. Her fist connects with a wet cracking sound, and Henry staggers back, his mouth bloodied and suddenly down two teeth.\n\n\"Ge\' her! Ge\' her!\" he screams through his cupped hand. But none of his friends seem too interested in taking up the fight. They take a couple steps back.\n\n\"Boo!\" Arlene yells, lunging forward. The high schoolers take off, leaving the candy behind. {{bully-ditches-your-candy}} Henry casts you both one last dirty glance and runs to catch up with his posse.\n\nYou pick up the candy that was left behind.\n"))));
   var block50 = label("egg-the-school")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\nDespite some concern that the bags of candy don\'t belong to the high schoolers, you let it go in favor of good, old-fashioned mischief. And, if you wanted to get that candy later, that would be unfortunate because on the way to the school, one of the teens splits up to drop the candy off at his house, promising to meet you at the school.\n\nThe remaining group of teens lead you and Arlene down a couple blocks until you arrive at a large, brown building with three rows of regularly spaced windows running along its sides. The parking lot is deserted, and the teens pull out a couple large crates of eggs from a backpack. The other arrives just as the first egg is about to be thrown. He is carrying an entire arsenal of toilet paper and shaving cream.\n\nYou and Arlene gladly join these hooligans in attempting to have at least one egg splattered on every window as well as mummifying every tree.\n\nHowever, in the middle of your fun, the cops show up. Figures.\n\nA pudgy officer steps out of the police car alongside his incredibly fit partner.\n\nArlene looks at the stain on the pudgy officer\'s shirt and mutters, \"Uh oh...\"\n\n\"Hey!\" the pudgy one shouts. \"You kids stop that immediately and don\'t move!\"\n\nApparently, the group of teens you fell in with aren\'t the most obedient crowd (I know, I\'m surprised too) because instead of not moving, they take off towards the wooded area behind the school. Henry yells, \"Follow us! We know a way out of here! Just gotta hop the fence!\"\n\n\"Not the fence!\" growls the pudgy cop. \"Damn them. They know my weakness.\"\n\n\"Oh, my. Such a predicament! What shall we do, Reader?\" Arlene asks, excitedly.\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Follow the group."
                 ,_1: $Maybe.Just("follow-the-group")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2(add,
                 "morality",
                 -2)])))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Split up and run with Arlene."
                 ,_1: $Maybe.Just("split-up")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2(add,
                 "morality",
                 -2)])))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Turn yourself in."
                 ,_1: $Maybe.Just("turn-yourself-in")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2(add,
                 "morality",
                 15)])))
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "Assault the cops."
                 ,_1: $Maybe.Just("assault-the-cops")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2(add,
                 "morality",
                 -50)])))
                 ,_3: $Maybe.Nothing}]),
   true));
   var block51 = function (b) {
      return _U.replace([["next"
                         ,function (vars) {
                            return _U.eq(A2($Dict.get,
                            "reader-costume",
                            vars.string),
                            $Maybe.Just("godzilla")) ? $InteractiveStory$Action.Label("game-over") : $InteractiveStory$Action.Label("intersection-1");
                         }]
                        ,["onLeave"
                         ,function (vars) {
                            return _U.eq(A2($Dict.get,
                            "reader-costume",
                            vars.string),
                            $Maybe.Just("godzilla")) ? A2(setVars,
                            _L.fromArray([A2($InteractiveStory$Action.SetString,
                                         "game-over-text",
                                         "Congratulations! You got arrested. You also stripped in front of Arlene. Awkward.")
                                         ,A2($InteractiveStory$Action.SetBool,
                                         "high-schoolers-gone",
                                         true)]),
                            vars) : A2(setVars,
                            _L.fromArray([A2($InteractiveStory$Action.SetBool,
                            "high-schoolers-gone",
                            true)]),
                            vars);
                         }]],
      b);
   }(label("follow-the-group")(A2($InteractiveStory$StoryBlock.conditionalTextBlock,
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: function (_) {
                    return _.string;
                 }
                 ,_1: "reader-costume"
                 ,_2: "godzilla"
                 ,_3: "\nYou and Arlene follow the teens with the cops chasing close behind, calling for you to stop immediately. The group runs into the woods and weaves this way and that until you all arrive at a tall, mesh fence. You have put some distance between yourselves and the cops, but not much.\n\nThe teens climb quickly over the fence and call for you to hurry up. And you would absolutely love to hurry up except you forgot you wore that ridiculous Godzilla costume and have absolutely no hope of getting over the tall fence, even with Arlene trying her best to help you. Realizing you are out of options, you begin stripping the costume off, piece by piece.\n\nUnfortunately, you are a bit too slow and end up standing in front of two angry cops in your underwear. Woops.\n  "}]),
   "\nYou and Arlene follow the teens with the cops chasing close behind, calling for you to stop immediately. The group runs into the woods and weaves this way and that until you all arrive at a tall, mesh fence. You have put some distance between yourselves and the cops, but not much.\n\nThe teens climb quickly over the fence and call for you to hurry up. You hop over the fence after them, and they lead you a roundabout way back out of the forest. The cops are left far behind you.\n\n\"You guys are pretty cool,\" Henry says, patting you amiably on the back. There is a murmur of agreement among the teens. \"Look, we\'re gonna head out for the night, but look for us next year, alright?\"\n\nWith that, the group disperses.\n\nArlene turns to you with a big smile on her face. \"So. Worth it.\"\n  ")));
   var block52 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
   "high-schoolers-gone",
   true)])))(label("split-up")($goto("intersection-1")($InteractiveStory$StoryBlock.contentBlock("\nYou and Arlene split up from the group and make a break for it on your own. The cops split up too, the fit one running after the teens and the pudgy one following close behind you. Well, he was close at least. At some point, he must have run out of breath because he is no longer anywhere in sight.\n\n\"Oh, my. That man really needs to hit the gym,\" Arlene giggles.\n"))));
   var block53 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                              "high-schoolers-gone",
                                              true)
                                              ,A2($InteractiveStory$Action.SetString,
                                              "game-over-text",
                                              "You turned yourself in. Uhh... good job, I guess?")])))(label("turn-yourself-in")($goto("game-over")($InteractiveStory$StoryBlock.contentBlock("\nYou raise both your hands into the air and approach the cops, apologizing profusely for your heinous crimes against a window. Arlene watches you get arrested, dumbfounded. Eventually, she just walks away shaking her head. You\'ll probably see her once you get back to the Party. You know, after your parents pick you up from the police station.\n"))));
   var block54 = onLeave(setVars(_L.fromArray([A2($InteractiveStory$Action.SetBool,
                                              "high-schoolers-gone",
                                              true)
                                              ,A2($InteractiveStory$Action.SetString,
                                              "game-over-text",
                                              "Congratulations! You got shot in the face.")
                                              ,A2($InteractiveStory$Action.SetString,
                                              "game-over-text-2",
                                              "No, seriously. You assaulted two men just trying to do their jobs. You are an awful person.")])))(label("assault-the-cops")($goto("game-over")($InteractiveStory$StoryBlock.contentBlock("\nYou charge at the cops, screaming incoherently and foaming from the mouth. They pull out their guns, but that doesn\'t stop you. Well, not until they pull the trigger.\n"))));
   var goHome = function (b) {
      return _U.replace([["contentGenerator"
                         ,F3(function (_v4,vars,_v5) {
                            return function () {
                               return function () {
                                  return function () {
                                     var returnCandyText = $Maybe.withDefault(false)(A2($Dict.get,
                                     "has-candy",
                                     vars.bool)) ? goHome_return_candy : "";
                                     var locations = _L.fromArray(["high-schoolers-gone"
                                                                  ,"done-with-kids"
                                                                  ,"done-with-old-lady"
                                                                  ,"visited-park"
                                                                  ,"visited-creepy-music-house"
                                                                  ,"visited-house-with-scarecrow"
                                                                  ,"visited-down-road"]);
                                     var completion = $List.length($List.filter($Basics.identity)(A2($List.map,
                                     function ($) {
                                        return $Maybe.withDefault(false)(A2($Basics.flip,
                                        $Dict.get,
                                        vars.bool)($));
                                     },
                                     locations)));
                                     var completionText = _U.eq(completion,
                                     0) ? goHome_completion_0 : _U.cmp(completion,
                                     5) < 0 ? goHome_completion_1 : _U.cmp(completion,
                                     7) < 0 ? goHome_completion_2 : "";
                                     return $Markdown.toHtml(A2($Basics._op["++"],
                                     completionText,
                                     returnCandyText));
                                  }();
                               }();
                            }();
                         })]],
      b);
   }(label("go-home")(A3($InteractiveStory$StoryBlock.choiceBlock,
   "",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Go home. *(This is it. Night\'s over.)*"
                 ,_1: $Maybe.Just("go-home-confirmed")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function ($) {
                    return $Basics.not($Maybe.withDefault(false)($Dict.get("has-candy")(function (_) {
                       return _.bool;
                    }($))));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Go home and keep children\'s candy. *(This is it. Night\'s over. And you\'re a jerk.)*"
                 ,_1: $Maybe.Just("go-home-confirmed")
                 ,_2: $Maybe.Just(setVars(_L.fromArray([A2(add,
                                                       "candy",
                                                       967)
                                                       ,A2(add,
                                                       "morality",
                                                       -7)])))
                 ,_3: $Maybe.Just(function ($) {
                    return $Maybe.withDefault(false)($Dict.get("has-candy")(function (_) {
                       return _.bool;
                    }($)));
                 })}
                ,{ctor: "_Tuple4"
                 ,_0: "Return to trick or treating."
                 ,_1: $Maybe.Just("intersection-1")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Just(function ($) {
                    return $Basics.not($Maybe.withDefault(false)($Dict.get("done-with-everything")(function (_) {
                       return _.bool;
                    }($))));
                 })}]),
   true)));
   var goHomeConfirmed = $goto("game-over")(label("go-home-confirmed")(_U.replace([["contentGenerator"
                                                                                   ,F3(function (_v8,
                                                                                   vars,
                                                                                   _v9) {
                                                                                      return function () {
                                                                                         return function () {
                                                                                            return function () {
                                                                                               var stoleCandy = $Maybe.withDefault(false)(A2($Dict.get,
                                                                                               "has-candy",
                                                                                               vars.bool));
                                                                                               var locations = _L.fromArray(["high-schoolers-gone"
                                                                                                                            ,"done-with-kids"
                                                                                                                            ,"done-with-old-lady"
                                                                                                                            ,"visited-park"
                                                                                                                            ,"visited-creepy-music-house"
                                                                                                                            ,"visited-house-with-scarecrow"
                                                                                                                            ,"visited-down-road"]);
                                                                                               var completion = $List.length($List.filter($Basics.identity)(A2($List.map,
                                                                                               function ($) {
                                                                                                  return $Maybe.withDefault(false)(A2($Basics.flip,
                                                                                                  $Dict.get,
                                                                                                  vars.bool)($));
                                                                                               },
                                                                                               locations)));
                                                                                               var goHomeText = _U.cmp(completion,
                                                                                               7) < 0 && stoleCandy ? go_home_confirmed_disapointing_stolen_candy : _U.cmp(completion,
                                                                                               7) < 0 && $Basics.not(stoleCandy) ? go_home_confirmed_disapointing : _U.cmp(completion,
                                                                                               7) > -1 && stoleCandy ? go_home_confirmed_stolen_candy : go_home_good_ending;
                                                                                               return $Markdown.toHtml(goHomeText);
                                                                                            }();
                                                                                         }();
                                                                                      }();
                                                                                   })]
                                                                                  ,["onLeave"
                                                                                   ,function (vars) {
                                                                                      return $Maybe.withDefault(false)(A2($Dict.get,
                                                                                      "has-candy",
                                                                                      vars.bool)) ? A2(setVars,
                                                                                      _L.fromArray([A2($InteractiveStory$Action.SetString,
                                                                                                   "game-over-text",
                                                                                                   "Congratulations! You actually stole candy from children. Quite a lot of it, at that. Ever hear the expression \"stealing candy from a baby\"? Yeah, you pretty much did that. Jerk.")
                                                                                                   ,A2($InteractiveStory$Action.SetString,
                                                                                                   "game-over-text-2",
                                                                                                   "But you\'re still a candy-stealing meanie.")]),
                                                                                      vars) : A2(setVars,
                                                                                      _L.fromArray([]),
                                                                                      vars);
                                                                                   }]],
   $InteractiveStory$StoryBlock.emptyStoryBlock)));
   var fadeIn = A3($InteractiveStory$Sound.fade,
   0,
   1,
   1500);
   var fadeOut = $InteractiveStory$Sound.reverseTransition(fadeIn);
   var countdown_block08 = _L.fromArray([onEnter(stopBGM($Maybe.Just(fadeOut)))($InteractiveStory$StoryBlock.contentBlock("\"One...\""))
                                        ,$InteractiveStory$StoryBlock.contentBlock("\"Two...\"")
                                        ,$InteractiveStory$StoryBlock.contentBlock("\"Two and a half...\"")
                                        ,$InteractiveStory$StoryBlock.contentBlock("\"Two and three quarters...\"")
                                        ,$InteractiveStory$StoryBlock.contentBlock("\"...\"")]);
   var block_pre_01 = onEnter(A3(bgm,
   "mansion-bgm",
   $Maybe.Just(fadeIn),
   $Maybe.Just(fadeOut)))(A3($InteractiveStory$StoryBlock.choiceBlock,
   "\n### Begin\nMarc has been gone for a little while now, and Arlene has taken to staring out the window again, much as how you first met her. Though it is hard to tell from behind, she seems rather bored, and now that no one else is around, she has allowed her shoulders to slump gloomily. As it is just about Halloween, perhaps she would like visit your world and go trick or treating, Reader. How about you invite her?\n",
   _L.fromArray([{ctor: "_Tuple4"
                 ,_0: "Invite Arlene."
                 ,_1: $Maybe.Just("invite-arlene")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}
                ,{ctor: "_Tuple4"
                 ,_0: "No, thanks."
                 ,_1: $Maybe.Just("bundle-of-fun")
                 ,_2: $Maybe.Nothing
                 ,_3: $Maybe.Nothing}]),
   true));
   var stuff = A2($Basics._op["++"],
   _L.fromArray([block_pre_01
                ,block_pre_02
                ,block01
                ,block02
                ,block03
                ,block04
                ,block05
                ,block06
                ,block07]),
   A2($Basics._op["++"],
   countdown_block08,
   _L.fromArray([block09
                ,block10
                ,block11
                ,block12
                ,block13
                ,block14
                ,block15
                ,block16
                ,block17
                ,block18
                ,block19
                ,block20
                ,block21
                ,block22
                ,block23
                ,block24
                ,block25
                ,block26
                ,block27
                ,block28
                ,block29
                ,block30
                ,block31
                ,block32
                ,block33
                ,block34
                ,block35
                ,block36
                ,block37
                ,block38
                ,block39
                ,block40
                ,block41
                ,block42
                ,block43
                ,block44
                ,block45
                ,block42_2
                ,block42_3
                ,block46
                ,block47
                ,block48
                ,block49
                ,block50
                ,block51
                ,block52
                ,block53
                ,block54
                ,gameover
                ,goHome
                ,goHomeConfirmed
                ,bundleOfFun])));
   _elm.StoryContent.values = {_op: _op
                              ,fadeIn: fadeIn
                              ,fadeOut: fadeOut
                              ,stuff: stuff
                              ,label: label
                              ,onEnter: onEnter
                              ,onLeave: onLeave
                              ,bgm: bgm
                              ,stopBGM: stopBGM
                              ,$goto: $goto
                              ,setVars: setVars
                              ,isTrue: isTrue
                              ,add: add
                              ,conditionalTextChoiceBlock: conditionalTextChoiceBlock
                              ,block_pre_01: block_pre_01
                              ,bundleOfFun: bundleOfFun
                              ,block_pre_02: block_pre_02
                              ,block01: block01
                              ,block02: block02
                              ,block03: block03
                              ,block04: block04
                              ,block05: block05
                              ,block06: block06
                              ,block07: block07
                              ,countdown_block08: countdown_block08
                              ,block09: block09
                              ,block10: block10
                              ,block11: block11
                              ,block12: block12
                              ,block13: block13
                              ,block14: block14
                              ,block15: block15
                              ,block16: block16
                              ,block17: block17
                              ,block18: block18
                              ,block19: block19
                              ,block20: block20
                              ,block21: block21
                              ,block22: block22
                              ,block23: block23
                              ,block24: block24
                              ,block25: block25
                              ,block26: block26
                              ,block27: block27
                              ,block28: block28
                              ,block29: block29
                              ,block30: block30
                              ,block31: block31
                              ,block32: block32
                              ,block33: block33
                              ,block34: block34
                              ,block35: block35
                              ,gameover: gameover
                              ,block36: block36
                              ,block37: block37
                              ,block38: block38
                              ,block39: block39
                              ,block40: block40
                              ,block41: block41
                              ,block42_3: block42_3
                              ,block42: block42
                              ,block42_2: block42_2
                              ,block43: block43
                              ,block44: block44
                              ,block44_1: block44_1
                              ,block44_2: block44_2
                              ,block44_2_1: block44_2_1
                              ,block44_3: block44_3
                              ,block44_4: block44_4
                              ,block44_5: block44_5
                              ,block44_6: block44_6
                              ,block45: block45
                              ,block46: block46
                              ,block47: block47
                              ,block48: block48
                              ,block49: block49
                              ,block50: block50
                              ,block51: block51
                              ,block52: block52
                              ,block53: block53
                              ,block54: block54
                              ,goHome: goHome
                              ,goHome_completion_0: goHome_completion_0
                              ,goHome_completion_1: goHome_completion_1
                              ,goHome_completion_2: goHome_completion_2
                              ,goHome_return_candy: goHome_return_candy
                              ,goHomeConfirmed: goHomeConfirmed
                              ,go_home_confirmed_disapointing: go_home_confirmed_disapointing
                              ,go_home_confirmed_stolen_candy: go_home_confirmed_stolen_candy
                              ,go_home_confirmed_disapointing_stolen_candy: go_home_confirmed_disapointing_stolen_candy
                              ,go_home_good_ending: go_home_good_ending};
   return _elm.StoryContent.values;
};
Elm.String = Elm.String || {};
Elm.String.make = function (_elm) {
   "use strict";
   _elm.String = _elm.String || {};
   if (_elm.String.values)
   return _elm.String.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "String",
   $Maybe = Elm.Maybe.make(_elm),
   $Native$String = Elm.Native.String.make(_elm),
   $Result = Elm.Result.make(_elm);
   var fromList = $Native$String.fromList;
   var toList = $Native$String.toList;
   var toFloat = $Native$String.toFloat;
   var toInt = $Native$String.toInt;
   var indices = $Native$String.indexes;
   var indexes = $Native$String.indexes;
   var endsWith = $Native$String.endsWith;
   var startsWith = $Native$String.startsWith;
   var contains = $Native$String.contains;
   var all = $Native$String.all;
   var any = $Native$String.any;
   var toLower = $Native$String.toLower;
   var toUpper = $Native$String.toUpper;
   var lines = $Native$String.lines;
   var words = $Native$String.words;
   var trimRight = $Native$String.trimRight;
   var trimLeft = $Native$String.trimLeft;
   var trim = $Native$String.trim;
   var padRight = $Native$String.padRight;
   var padLeft = $Native$String.padLeft;
   var pad = $Native$String.pad;
   var dropRight = $Native$String.dropRight;
   var dropLeft = $Native$String.dropLeft;
   var right = $Native$String.right;
   var left = $Native$String.left;
   var slice = $Native$String.slice;
   var repeat = $Native$String.repeat;
   var join = $Native$String.join;
   var split = $Native$String.split;
   var foldr = $Native$String.foldr;
   var foldl = $Native$String.foldl;
   var reverse = $Native$String.reverse;
   var filter = $Native$String.filter;
   var map = $Native$String.map;
   var length = $Native$String.length;
   var concat = $Native$String.concat;
   var append = $Native$String.append;
   var uncons = $Native$String.uncons;
   var cons = $Native$String.cons;
   var fromChar = function ($char) {
      return A2(cons,$char,"");
   };
   var isEmpty = $Native$String.isEmpty;
   _elm.String.values = {_op: _op
                        ,isEmpty: isEmpty
                        ,length: length
                        ,reverse: reverse
                        ,repeat: repeat
                        ,cons: cons
                        ,uncons: uncons
                        ,fromChar: fromChar
                        ,append: append
                        ,concat: concat
                        ,split: split
                        ,join: join
                        ,words: words
                        ,lines: lines
                        ,slice: slice
                        ,left: left
                        ,right: right
                        ,dropLeft: dropLeft
                        ,dropRight: dropRight
                        ,contains: contains
                        ,startsWith: startsWith
                        ,endsWith: endsWith
                        ,indexes: indexes
                        ,indices: indices
                        ,toInt: toInt
                        ,toFloat: toFloat
                        ,toList: toList
                        ,fromList: fromList
                        ,toUpper: toUpper
                        ,toLower: toLower
                        ,pad: pad
                        ,padLeft: padLeft
                        ,padRight: padRight
                        ,trim: trim
                        ,trimLeft: trimLeft
                        ,trimRight: trimRight
                        ,map: map
                        ,filter: filter
                        ,foldl: foldl
                        ,foldr: foldr
                        ,any: any
                        ,all: all};
   return _elm.String.values;
};
Elm.Task = Elm.Task || {};
Elm.Task.make = function (_elm) {
   "use strict";
   _elm.Task = _elm.Task || {};
   if (_elm.Task.values)
   return _elm.Task.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Task",
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Task = Elm.Native.Task.make(_elm),
   $Result = Elm.Result.make(_elm);
   var sleep = $Native$Task.sleep;
   var spawn = $Native$Task.spawn;
   var ThreadID = function (a) {
      return {ctor: "ThreadID"
             ,_0: a};
   };
   var onError = $Native$Task.catch_;
   var andThen = $Native$Task.andThen;
   var fail = $Native$Task.fail;
   var mapError = F2(function (f,
   promise) {
      return A2(onError,
      promise,
      function (err) {
         return fail(f(err));
      });
   });
   var succeed = $Native$Task.succeed;
   var map = F2(function (func,
   promiseA) {
      return A2(andThen,
      promiseA,
      function (a) {
         return succeed(func(a));
      });
   });
   var map2 = F3(function (func,
   promiseA,
   promiseB) {
      return A2(andThen,
      promiseA,
      function (a) {
         return A2(andThen,
         promiseB,
         function (b) {
            return succeed(A2(func,a,b));
         });
      });
   });
   var map3 = F4(function (func,
   promiseA,
   promiseB,
   promiseC) {
      return A2(andThen,
      promiseA,
      function (a) {
         return A2(andThen,
         promiseB,
         function (b) {
            return A2(andThen,
            promiseC,
            function (c) {
               return succeed(A3(func,
               a,
               b,
               c));
            });
         });
      });
   });
   var map4 = F5(function (func,
   promiseA,
   promiseB,
   promiseC,
   promiseD) {
      return A2(andThen,
      promiseA,
      function (a) {
         return A2(andThen,
         promiseB,
         function (b) {
            return A2(andThen,
            promiseC,
            function (c) {
               return A2(andThen,
               promiseD,
               function (d) {
                  return succeed(A4(func,
                  a,
                  b,
                  c,
                  d));
               });
            });
         });
      });
   });
   var map5 = F6(function (func,
   promiseA,
   promiseB,
   promiseC,
   promiseD,
   promiseE) {
      return A2(andThen,
      promiseA,
      function (a) {
         return A2(andThen,
         promiseB,
         function (b) {
            return A2(andThen,
            promiseC,
            function (c) {
               return A2(andThen,
               promiseD,
               function (d) {
                  return A2(andThen,
                  promiseE,
                  function (e) {
                     return succeed(A5(func,
                     a,
                     b,
                     c,
                     d,
                     e));
                  });
               });
            });
         });
      });
   });
   var andMap = F2(function (promiseFunc,
   promiseValue) {
      return A2(andThen,
      promiseFunc,
      function (func) {
         return A2(andThen,
         promiseValue,
         function (value) {
            return succeed(func(value));
         });
      });
   });
   var sequence = function (promises) {
      return function () {
         switch (promises.ctor)
         {case "::": return A3(map2,
              F2(function (x,y) {
                 return A2($List._op["::"],
                 x,
                 y);
              }),
              promises._0,
              sequence(promises._1));
            case "[]":
            return succeed(_L.fromArray([]));}
         _U.badCase($moduleName,
         "between lines 101 and 106");
      }();
   };
   var toMaybe = function (task) {
      return A2(onError,
      A2(map,$Maybe.Just,task),
      function (_v3) {
         return function () {
            return succeed($Maybe.Nothing);
         }();
      });
   };
   var fromMaybe = F2(function ($default,
   maybe) {
      return function () {
         switch (maybe.ctor)
         {case "Just":
            return succeed(maybe._0);
            case "Nothing":
            return fail($default);}
         _U.badCase($moduleName,
         "between lines 139 and 141");
      }();
   });
   var toResult = function (task) {
      return A2(onError,
      A2(map,$Result.Ok,task),
      function (msg) {
         return succeed($Result.Err(msg));
      });
   };
   var fromResult = function (result) {
      return function () {
         switch (result.ctor)
         {case "Err":
            return fail(result._0);
            case "Ok":
            return succeed(result._0);}
         _U.badCase($moduleName,
         "between lines 151 and 153");
      }();
   };
   var Task = {ctor: "Task"};
   _elm.Task.values = {_op: _op
                      ,succeed: succeed
                      ,fail: fail
                      ,map: map
                      ,map2: map2
                      ,map3: map3
                      ,map4: map4
                      ,map5: map5
                      ,andMap: andMap
                      ,sequence: sequence
                      ,andThen: andThen
                      ,onError: onError
                      ,mapError: mapError
                      ,toMaybe: toMaybe
                      ,fromMaybe: fromMaybe
                      ,toResult: toResult
                      ,fromResult: fromResult
                      ,spawn: spawn
                      ,sleep: sleep};
   return _elm.Task.values;
};
Elm.Text = Elm.Text || {};
Elm.Text.make = function (_elm) {
   "use strict";
   _elm.Text = _elm.Text || {};
   if (_elm.Text.values)
   return _elm.Text.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Text",
   $Color = Elm.Color.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Text = Elm.Native.Text.make(_elm);
   var line = $Native$Text.line;
   var italic = $Native$Text.italic;
   var bold = $Native$Text.bold;
   var color = $Native$Text.color;
   var height = $Native$Text.height;
   var link = $Native$Text.link;
   var monospace = $Native$Text.monospace;
   var typeface = $Native$Text.typeface;
   var style = $Native$Text.style;
   var append = $Native$Text.append;
   var fromString = $Native$Text.fromString;
   var empty = fromString("");
   var concat = function (texts) {
      return A3($List.foldr,
      append,
      empty,
      texts);
   };
   var join = F2(function (seperator,
   texts) {
      return concat(A2($List.intersperse,
      seperator,
      texts));
   });
   var defaultStyle = {_: {}
                      ,bold: false
                      ,color: $Color.black
                      ,height: $Maybe.Nothing
                      ,italic: false
                      ,line: $Maybe.Nothing
                      ,typeface: _L.fromArray([])};
   var Style = F6(function (a,
   b,
   c,
   d,
   e,
   f) {
      return {_: {}
             ,bold: d
             ,color: c
             ,height: b
             ,italic: e
             ,line: f
             ,typeface: a};
   });
   var Through = {ctor: "Through"};
   var Over = {ctor: "Over"};
   var Under = {ctor: "Under"};
   var Text = {ctor: "Text"};
   _elm.Text.values = {_op: _op
                      ,fromString: fromString
                      ,empty: empty
                      ,append: append
                      ,concat: concat
                      ,join: join
                      ,link: link
                      ,style: style
                      ,defaultStyle: defaultStyle
                      ,typeface: typeface
                      ,monospace: monospace
                      ,height: height
                      ,color: color
                      ,bold: bold
                      ,italic: italic
                      ,line: line
                      ,Style: Style
                      ,Under: Under
                      ,Over: Over
                      ,Through: Through};
   return _elm.Text.values;
};
Elm.Time = Elm.Time || {};
Elm.Time.make = function (_elm) {
   "use strict";
   _elm.Time = _elm.Time || {};
   if (_elm.Time.values)
   return _elm.Time.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Time",
   $Basics = Elm.Basics.make(_elm),
   $Native$Signal = Elm.Native.Signal.make(_elm),
   $Native$Time = Elm.Native.Time.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var delay = $Native$Signal.delay;
   var since = F2(function (time,
   signal) {
      return function () {
         var stop = A2($Signal.map,
         $Basics.always(-1),
         A2(delay,time,signal));
         var start = A2($Signal.map,
         $Basics.always(1),
         signal);
         var delaydiff = A3($Signal.foldp,
         F2(function (x,y) {
            return x + y;
         }),
         0,
         A2($Signal.merge,start,stop));
         return A2($Signal.map,
         F2(function (x,y) {
            return !_U.eq(x,y);
         })(0),
         delaydiff);
      }();
   });
   var timestamp = $Native$Signal.timestamp;
   var every = $Native$Time.every;
   var fpsWhen = $Native$Time.fpsWhen;
   var fps = function (targetFrames) {
      return A2(fpsWhen,
      targetFrames,
      $Signal.constant(true));
   };
   var inMilliseconds = function (t) {
      return t;
   };
   var millisecond = 1;
   var second = 1000 * millisecond;
   var minute = 60 * second;
   var hour = 60 * minute;
   var inHours = function (t) {
      return t / hour;
   };
   var inMinutes = function (t) {
      return t / minute;
   };
   var inSeconds = function (t) {
      return t / second;
   };
   _elm.Time.values = {_op: _op
                      ,millisecond: millisecond
                      ,second: second
                      ,minute: minute
                      ,hour: hour
                      ,inMilliseconds: inMilliseconds
                      ,inSeconds: inSeconds
                      ,inMinutes: inMinutes
                      ,inHours: inHours
                      ,fps: fps
                      ,fpsWhen: fpsWhen
                      ,every: every
                      ,timestamp: timestamp
                      ,delay: delay
                      ,since: since};
   return _elm.Time.values;
};
Elm.Transform2D = Elm.Transform2D || {};
Elm.Transform2D.make = function (_elm) {
   "use strict";
   _elm.Transform2D = _elm.Transform2D || {};
   if (_elm.Transform2D.values)
   return _elm.Transform2D.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Transform2D",
   $Native$Transform2D = Elm.Native.Transform2D.make(_elm);
   var multiply = $Native$Transform2D.multiply;
   var rotation = $Native$Transform2D.rotation;
   var matrix = $Native$Transform2D.matrix;
   var translation = F2(function (x,
   y) {
      return A6(matrix,
      1,
      0,
      0,
      1,
      x,
      y);
   });
   var scale = function (s) {
      return A6(matrix,
      s,
      0,
      0,
      s,
      0,
      0);
   };
   var scaleX = function (x) {
      return A6(matrix,
      x,
      0,
      0,
      1,
      0,
      0);
   };
   var scaleY = function (y) {
      return A6(matrix,
      1,
      0,
      0,
      y,
      0,
      0);
   };
   var identity = $Native$Transform2D.identity;
   var Transform2D = {ctor: "Transform2D"};
   _elm.Transform2D.values = {_op: _op
                             ,identity: identity
                             ,matrix: matrix
                             ,multiply: multiply
                             ,rotation: rotation
                             ,translation: translation
                             ,scale: scale
                             ,scaleX: scaleX
                             ,scaleY: scaleY};
   return _elm.Transform2D.values;
};
Elm.Vendor = Elm.Vendor || {};
Elm.Vendor.make = function (_elm) {
   "use strict";
   _elm.Vendor = _elm.Vendor || {};
   if (_elm.Vendor.values)
   return _elm.Vendor.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Vendor",
   $Basics = Elm.Basics.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$Vendor = Elm.Native.Vendor.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var O = {ctor: "O"};
   var MS = {ctor: "MS"};
   var Webkit = {ctor: "Webkit"};
   var Moz = {ctor: "Moz"};
   var prefix = function () {
      var _v0 = $Native$Vendor.prefix;
      switch (_v0)
      {case "moz": return Moz;
         case "ms": return MS;
         case "o": return O;
         case "webkit": return Webkit;}
      _U.badCase($moduleName,
      "between lines 27 and 31");
   }();
   _elm.Vendor.values = {_op: _op
                        ,prefix: prefix
                        ,Moz: Moz
                        ,Webkit: Webkit
                        ,MS: MS
                        ,O: O};
   return _elm.Vendor.values;
};
Elm.VirtualDom = Elm.VirtualDom || {};
Elm.VirtualDom.make = function (_elm) {
   "use strict";
   _elm.VirtualDom = _elm.VirtualDom || {};
   if (_elm.VirtualDom.values)
   return _elm.VirtualDom.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "VirtualDom",
   $Basics = Elm.Basics.make(_elm),
   $Graphics$Element = Elm.Graphics.Element.make(_elm),
   $Json$Decode = Elm.Json.Decode.make(_elm),
   $List = Elm.List.make(_elm),
   $Maybe = Elm.Maybe.make(_elm),
   $Native$VirtualDom = Elm.Native.VirtualDom.make(_elm),
   $Result = Elm.Result.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var lazy3 = $Native$VirtualDom.lazy3;
   var lazy2 = $Native$VirtualDom.lazy2;
   var lazy = $Native$VirtualDom.lazy;
   var defaultOptions = {_: {}
                        ,preventDefault: false
                        ,stopPropagation: false};
   var Options = F2(function (a,
   b) {
      return {_: {}
             ,preventDefault: b
             ,stopPropagation: a};
   });
   var onWithOptions = $Native$VirtualDom.on;
   var on = F3(function (eventName,
   decoder,
   toMessage) {
      return A4($Native$VirtualDom.on,
      eventName,
      defaultOptions,
      decoder,
      toMessage);
   });
   var attributeNS = $Native$VirtualDom.attributeNS;
   var attribute = $Native$VirtualDom.attribute;
   var property = $Native$VirtualDom.property;
   var Property = {ctor: "Property"};
   var fromElement = $Native$VirtualDom.fromElement;
   var toElement = $Native$VirtualDom.toElement;
   var text = $Native$VirtualDom.text;
   var node = $Native$VirtualDom.node;
   var Node = {ctor: "Node"};
   _elm.VirtualDom.values = {_op: _op
                            ,text: text
                            ,node: node
                            ,toElement: toElement
                            ,fromElement: fromElement
                            ,property: property
                            ,attribute: attribute
                            ,attributeNS: attributeNS
                            ,on: on
                            ,onWithOptions: onWithOptions
                            ,defaultOptions: defaultOptions
                            ,lazy: lazy
                            ,lazy2: lazy2
                            ,lazy3: lazy3
                            ,Options: Options};
   return _elm.VirtualDom.values;
};
Elm.Window = Elm.Window || {};
Elm.Window.make = function (_elm) {
   "use strict";
   _elm.Window = _elm.Window || {};
   if (_elm.Window.values)
   return _elm.Window.values;
   var _op = {},
   _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   $moduleName = "Window",
   $Basics = Elm.Basics.make(_elm),
   $Native$Window = Elm.Native.Window.make(_elm),
   $Signal = Elm.Signal.make(_elm);
   var dimensions = $Native$Window.dimensions;
   var width = A2($Signal.map,
   $Basics.fst,
   dimensions);
   var height = A2($Signal.map,
   $Basics.snd,
   dimensions);
   _elm.Window.values = {_op: _op
                        ,dimensions: dimensions
                        ,width: width
                        ,height: height};
   return _elm.Window.values;
};
