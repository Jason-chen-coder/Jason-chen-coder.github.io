//#region \0rolldown/runtime.js
var e = Object.defineProperty, t = (e, t, n) => () => {
	if (n) throw n[0];
	try {
		return e && (t = e(e = 0)), t;
	} catch (e) {
		throw n = [e], e;
	}
}, n = (t, n) => {
	let r = {};
	for (var i in t) e(r, i, {
		get: t[i],
		enumerable: !0
	});
	return n || e(r, Symbol.toStringTag, { value: "Module" }), r;
}, r = t((() => {})), i = t((() => {})), a = t((() => {
	r(), i();
}));
//#endregion
//#region node_modules/svelte/src/internal/shared/utils.js
function o(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function s() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var c, l, u, d, f, p, m, h, g, _, v, y, b = t((() => {
	c = Array.isArray, l = Array.prototype.indexOf, u = Array.prototype.includes, d = Array.from, f = Object.defineProperty, p = Object.getOwnPropertyDescriptor, m = Object.getOwnPropertyDescriptors, h = Object.prototype, g = Array.prototype, _ = Object.getPrototypeOf, v = Object.isExtensible, y = () => {};
})), x, S, C, w, ee, te, ne, re, ie, ae, oe, se, ce, le, ue, de, fe, pe, me, he, ge, _e, ve, ye, be, T = t((() => {
	x = 1 << 24, S = 1024, C = 2048, w = 4096, ee = 8192, te = 16384, ne = 32768, re = 1 << 25, ie = 65536, ae = 1 << 19, oe = 1 << 20, se = 1 << 25, ce = 65536, le = 1 << 21, ue = 1 << 22, de = 1 << 23, fe = Symbol("$state"), pe = Symbol("legacy props"), me = Symbol(""), he = Symbol("attributes"), ge = Symbol("class"), _e = Symbol("style"), ve = Symbol("text"), ye = new class extends Error {
		name = "StaleReactionError";
		message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
	}(), be = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
}));
function xe(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
var Se = t((() => {
	a();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Ce() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function we(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Te(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Ee() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function De(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function Oe() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function ke(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function Ae() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function je() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Me() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ne() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
var Pe = t((() => {
	a(), Se();
})), Fe, E, Ie, Le, Re, ze = t((() => {
	Fe = {}, E = Symbol("uninitialized"), Ie = "http://www.w3.org/1999/xhtml", Le = "http://www.w3.org/2000/svg", Re = "http://www.w3.org/1998/Math/MathML";
}));
function Be() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Ve(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function He() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
var Ue = t((() => {
	a();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
function We(e) {
	O = e;
}
function Ge(e) {
	if (e === null) throw Ve(), Fe;
	return k = e;
}
function Ke() {
	return Ge(/* @__PURE__ */ Kn(k));
}
function D(e) {
	if (O) {
		if (/* @__PURE__ */ Kn(k) !== null) throw Ve(), Fe;
		k = e;
	}
}
function qe(e = 1) {
	if (O) {
		for (var t = e, n = k; t--;) n = /* @__PURE__ */ Kn(n);
		k = n;
	}
}
function Je(e = !0) {
	for (var t = 0, n = k;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ Kn(n);
		e && n.remove(), n = i;
	}
}
function Ye(e) {
	if (!e || e.nodeType !== 8) throw Ve(), Fe;
	return e.data;
}
var O, k, A = t((() => {
	T(), ze(), Ue(), z(), O = !1;
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Xe(e) {
	return e === this.v;
}
function Ze(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Qe(e) {
	return !Ze(e, this.v);
}
var $e = t((() => {}));
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
function et() {
	nt = !0;
}
var tt, nt, rt = t((() => {
	tt = !1, nt = !1;
})), it = t((() => {
	b();
})), at = t((() => {
	it(), T(), B(), W();
})), ot = t((() => {
	a(), b(), Se();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
function st(e) {
	j = e;
}
function ct(e, t = !1, n) {
	j = {
		p: j,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: U,
		l: nt && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function lt(e) {
	var t = j, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) fr(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, j = t.p, e ?? {};
}
function ut() {
	return !nt || j !== null && j.l === null;
}
var j, M = t((() => {
	a(), Pe(), W(), B(), rt(), T(), j = null;
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
function dt() {
	var e = mt;
	mt = [], o(e);
}
function ft(e) {
	if (mt.length === 0 && !xn) {
		var t = mt;
		queueMicrotask(() => {
			t === mt && dt();
		});
	}
	mt.push(e);
}
function pt() {
	for (; mt.length > 0;) dt();
}
var mt, ht = t((() => {
	b(), kn(), mt = [];
}));
//#endregion
//#region node_modules/svelte/src/internal/client/error-handling.js
function gt(e) {
	var t = U;
	if (t === null) return H.f |= de, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	_t(e, t);
}
function _t(e, t) {
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
var vt = t((() => {
	a(), ze(), z(), T(), b(), W();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
function N(e, t) {
	e.f = e.f & bt | t;
}
function yt(e) {
	e.f & 512 || e.deps === null ? N(e, S) : N(e, w);
}
var bt, xt = t((() => {
	T(), bt = ~(C | w | S);
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function St(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= ce, St(t.deps));
}
function Ct(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), St(e.deps), N(e, S);
}
var wt = t((() => {
	T(), xt();
}));
//#endregion
//#region node_modules/svelte/src/store/utils.js
function Tt(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), y;
	let r = Qr(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
var Et = t((() => {
	W(), b();
}));
//#endregion
//#region node_modules/svelte/src/store/shared/index.js
function Dt(e, t = y) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Ze(e, t) && (e = t, n)) {
			let t = !kt.length;
			for (let t of r) t[1](), kt.push(t, e);
			if (t) {
				for (let e = 0; e < kt.length; e += 2) kt[e][0](kt[e + 1]);
				kt.length = 0;
			}
		}
	}
	function a(t) {
		i(t(e));
	}
	function o(o, s = y) {
		let c = [o, s];
		return r.add(c), r.size === 1 && (n = t(i, a) || y), o(e), () => {
			r.delete(c), r.size === 0 && n && (n(), n = null);
		};
	}
	return {
		set: i,
		update: a,
		subscribe: o
	};
}
function Ot(e) {
	let t;
	return Tt(e, (e) => t = e)(), t;
}
var kt, At = t((() => {
	b(), $e(), Et(), kt = [];
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
function jt(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ Mn(void 0),
		unsubscribe: y
	};
	if (r.store !== e && !(It in n)) if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = y;
	else {
		var i = !0;
		r.unsubscribe = Tt(e, (e) => {
			i ? r.source.v = e : F(r.source, e);
		}), i = !1;
	}
	return e && It in n ? Ot(e) : V(r.source);
}
function Mt() {
	let e = {};
	function t() {
		ur(() => {
			for (var t in e) e[t].unsubscribe();
			f(e, It, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function Nt(e) {
	var t = Ft;
	try {
		return Ft = !1, [e(), Ft];
	} finally {
		Ft = t;
	}
}
var Pt, Ft, It, Lt = t((() => {
	Et(), At(), b(), W(), B(), I(), a(), Pt = !1, Ft = !1, It = Symbol("unmounted");
})), Rt = t((() => {
	T(), it(), W();
}));
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function zt(e) {
	let t = 0, n = An(0), r;
	return () => {
		lr() && (V(n), vr(() => (t === 0 && (r = Qr(() => e(() => Fn(n)))), t += 1, () => {
			ft(() => {
				--t, t === 0 && (r?.(), r = void 0, Fn(n));
			});
		})));
	};
}
var Bt = t((() => {
	W(), B(), I(), at(), a(), ht();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
function Vt(e, t, n, r) {
	new Ut(e, t, n, r);
}
var Ht, Ut, Wt = t((() => {
	T(), ze(), M(), vt(), B(), W(), A(), ht(), Pe(), Ue(), a(), kn(), I(), at(), Bt(), z(), wt(), Ht = ie | ae, Ut = class {
		parent;
		is_pending = !1;
		transform_error;
		#e;
		#t = O ? k : null;
		#n;
		#r;
		#i;
		#a = null;
		#o = null;
		#s = null;
		#c = null;
		#l = 0;
		#u = 0;
		#d = !1;
		#f = /* @__PURE__ */ new Set();
		#p = /* @__PURE__ */ new Set();
		#m = null;
		#h = zt(() => (this.#m = An(this.#l), () => {
			this.#m = null;
		}));
		constructor(e, t, n, r) {
			this.#e = e, this.#n = t, this.#r = (e) => {
				var t = U;
				t.b = this, t.f |= 128, n(e);
			}, this.parent = U.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = br(() => {
				if (O) {
					let e = this.#t;
					Ke();
					let t = e.data === "[!";
					if (e.data.startsWith("[?")) {
						let t = JSON.parse(e.data.slice(2));
						this.#_(t);
					} else t ? this.#v() : this.#g();
				} else this.#y();
			}, Ht), O && (this.#e = k);
		}
		#g() {
			try {
				this.#a = Sr(() => this.#r(this.#e));
			} catch (e) {
				this.error(e);
			}
		}
		#_(e) {
			let t = this.#n.failed;
			t && (this.#s = Sr(() => {
				t(this.#e, () => e, () => () => {});
			}));
		}
		#v() {
			let e = this.#n.pending;
			e && (this.is_pending = !0, this.#o = Sr(() => e(this.#e)), ft(() => {
				var e = this.#c = document.createDocumentFragment(), t = Wn();
				e.append(t), this.#a = this.#x(() => Sr(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, kr(this.#o, () => {
					this.#o = null;
				}), this.#b(P));
			}));
		}
		#y() {
			try {
				if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Sr(() => {
					this.#r(this.#e);
				}), this.#u > 0) {
					var e = this.#c = document.createDocumentFragment();
					Nr(this.#a, e);
					let t = this.#n.pending;
					this.#o = Sr(() => t(this.#e));
				} else this.#b(P);
			} catch (e) {
				this.error(e);
			}
		}
		#b(e) {
			this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
		}
		defer_effect(e) {
			Ct(e, this.#f, this.#p);
		}
		is_rendered() {
			return !this.is_pending && (!this.parent || this.parent.is_rendered());
		}
		has_pending_snippet() {
			return !!this.#n.pending;
		}
		#x(e) {
			var t = U, n = H, r = j;
			Rr(this.#i), Lr(this.#i), st(this.#i.ctx);
			try {
				return Dn.ensure(), e();
			} catch (e) {
				return gt(e), null;
			} finally {
				Rr(t), Lr(n), st(r);
			}
		}
		#S(e, t) {
			if (!this.has_pending_snippet()) {
				this.parent && this.parent.#S(e, t);
				return;
			}
			this.#u += e, this.#u === 0 && (this.#b(t), this.#o && kr(this.#o, () => {
				this.#o = null;
			}), this.#c &&= (this.#e.before(this.#c), null));
		}
		update_pending_count(e, t) {
			this.#S(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, ft(() => {
				this.#d = !1, this.#m && Nn(this.#m, this.#l);
			}));
		}
		get_effect_pending() {
			return this.#h(), V(this.#m);
		}
		error(e) {
			if (!this.#n.onerror && !this.#n.failed) throw e;
			P?.is_fork ? (this.#a && P.skip_effect(this.#a), this.#o && P.skip_effect(this.#o), this.#s && P.skip_effect(this.#s), P.oncommit(() => {
				this.#C(e);
			})) : this.#C(e);
		}
		#C(e) {
			this.#a &&= (Er(this.#a), null), this.#o &&= (Er(this.#o), null), this.#s &&= (Er(this.#s), null), O && (Ge(this.#t), qe(), Ge(Je()));
			var t = this.#n.onerror;
			let n = this.#n.failed;
			var r = !1, i = !1;
			let a = () => {
				if (r) {
					He();
					return;
				}
				r = !0, i && Ne(), this.#s !== null && kr(this.#s, () => {
					this.#s = null;
				}), this.#x(() => {
					this.#y();
				});
			}, o = (e) => {
				try {
					i = !0, t?.(e, a), i = !1;
				} catch (e) {
					_t(e, this.#i && this.#i.parent);
				}
				n && (this.#s = this.#x(() => {
					try {
						return Sr(() => {
							var t = U;
							t.b = this, t.f |= 128, n(this.#e, () => e, () => a);
						});
					} catch (e) {
						return _t(e, this.#i.parent), null;
					}
				}));
			};
			ft(() => {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					_t(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(o, (e) => _t(e, this.#i && this.#i.parent)) : o(t);
			});
		}
	};
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function Gt(e, t, n, r) {
	let i = ut() ? Xt : $t;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = U, c = Kt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				_t(e, s);
			}
			qt();
		}
	}
	var d = Jt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Zt(e))).then(u).catch((e) => _t(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), qt();
	}) : f();
}
function Kt() {
	var e = U, t = H, n = j, r = P;
	return function(i = !0) {
		Rr(e), Lr(t), st(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function qt(e = !0) {
	Rr(null), Lr(null), st(null), e && P?.deactivate();
}
function Jt() {
	var e = U, t = e.b, n = P, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
var Yt = t((() => {
	T(), a(), M(), Wt(), vt(), W(), kn(), sn(), B(), ht();
}));
/*#__NO_SIDE_EFFECTS__*/
function Xt(e) {
	var t = 2 | C;
	return U !== null && (U.f |= ae), {
		ctx: j,
		deps: null,
		effects: null,
		equals: Xe,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: E,
		wv: 0,
		parent: U,
		ac: null
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Zt(e, t, n) {
	let r = U;
	r === null && Ce();
	var i = void 0, a = An(E), o = !H, c = /* @__PURE__ */ new Set();
	return _r(() => {
		var t = U, n = s();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== ye && n.reject(e);
			}).finally(qt);
		} catch (e) {
			n.reject(e), qt();
		}
		var l = P;
		if (o) {
			if (t.f & 32768) var u = Jt();
			if (r.b?.is_rendered()) l.async_deriveds.get(t)?.reject(on);
			else for (let e of c.values()) e.reject(on);
			c.add(n), l.async_deriveds.set(t, n);
		}
		let d = (e, t = void 0) => {
			u?.(), c.delete(n), t !== on && (l.activate(), t ? (a.f |= de, Nn(a, t)) : (a.f & 8388608 && (a.f ^= de), Nn(a, e)), l.deactivate());
		};
		n.promise.then(d, (e) => d(null, e || "unknown"));
	}), ur(() => {
		for (let e of c) e.reject(on);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(a) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function Qt(e) {
	let t = /* @__PURE__ */ Xt(e);
	return tt || zr(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function $t(e) {
	let t = /* @__PURE__ */ Xt(e);
	return t.equals = Qe, t;
}
function en(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Er(t[n]);
	}
}
function tn(e) {
	var t, n = U, r = e.parent;
	if (!ni && r !== null && e.v !== E && r.f & 24576) return Be(), e.v;
	Rr(r);
	try {
		e.f &= ~ce, en(e), t = Gr(e);
	} finally {
		Rr(n);
	}
	return t;
}
function nn(e) {
	var t = tn(e);
	if (!e.equals(t) && (e.wv = Hr(), (!P?.is_fork || e.deps === null) && (P === null ? e.v = t : (P.capture(e, t, !0), vn?.capture(e, t, !0)), e.deps === null))) {
		N(e, S);
		return;
	}
	ni || (yn === null ? yt(e) : (lr() || P?.is_fork) && yn.set(e, t));
}
function rn(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(ye), t.fn !== null && (t.teardown = y), t.ac = null, qr(t, 0), wr(t));
}
function an(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Jr(t);
}
var on, sn = t((() => {
	a(), T(), W(), $e(), Pe(), Ue(), B(), I(), ot(), rt(), M(), ze(), kn(), Yt(), b(), xt(), on = Symbol("obsolete");
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
function cn(e) {
	var t = xn;
	xn = !0;
	try {
		var n;
		for (e && (P !== null && !P.is_fork && P.flush(), n = e());;) {
			if (pt(), P === null) return n;
			P.flush();
		}
	} finally {
		xn = t;
	}
}
function ln() {
	try {
		Oe();
	} catch (e) {
		_t(e, bn);
	}
}
function un(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Ur(r) && (On = /* @__PURE__ */ new Set(), Jr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && Or(r), On?.size > 0)) {
				Rn.clear();
				for (let e of On) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) On.has(n) && (On.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Jr(n);
					}
				}
				On.clear();
			}
		}
		On = null;
	}
}
function dn(e, t, n, r) {
	if (!n.has(e) && (n.add(e), e.reactions !== null)) for (let i of e.reactions) {
		let e = i.f;
		e & 2 ? dn(i, t, n, r) : e & 4194320 && !(e & 2048) && fn(i, t, r) && (N(i, C), pn(i));
	}
}
function fn(e, t, n) {
	let r = n.get(e);
	if (r !== void 0) return r;
	if (e.deps !== null) for (let r of e.deps) {
		if (u.call(t, r)) return !0;
		if (r.f & 2 && fn(r, t, n)) return n.set(r, !0), !0;
	}
	return n.set(e, !1), !1;
}
function pn(e) {
	P.schedule(e);
}
function mn(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), N(e, S);
		for (var n = e.first; n !== null;) mn(n, t), n = n.next;
	}
}
function hn(e) {
	N(e, S);
	for (var t = e.first; t !== null;) hn(t), t = t.next;
}
var gn, _n, P, vn, yn, bn, xn, Sn, Cn, wn, Tn, En, Dn, On, kn = t((() => {
	T(), rt(), b(), W(), Pe(), ht(), a(), vt(), I(), B(), wt(), ze(), xt(), Lt(), ot(), Rt(), sn(), gn = null, _n = null, P = null, vn = null, yn = null, bn = null, xn = !1, Sn = !1, Cn = null, wn = null, Tn = 0, En = 1, Dn = class e {
		id = En++;
		#e = !1;
		linked = !0;
		#t = null;
		#n = null;
		async_deriveds = /* @__PURE__ */ new Map();
		current = /* @__PURE__ */ new Map();
		previous = /* @__PURE__ */ new Map();
		#r = /* @__PURE__ */ new Set();
		#i = /* @__PURE__ */ new Set();
		#a = 0;
		#o = /* @__PURE__ */ new Map();
		#s = null;
		#c = [];
		#l = [];
		#u = /* @__PURE__ */ new Set();
		#d = /* @__PURE__ */ new Set();
		#f = /* @__PURE__ */ new Map();
		#p = /* @__PURE__ */ new Set();
		is_fork = !1;
		#m = !1;
		constructor() {
			_n === null ? gn = _n = this : (_n.#n = this, this.#t = _n), _n = this;
		}
		#h() {
			if (this.is_fork) return !0;
			for (let n of this.#o.keys()) {
				for (var e = n, t = !1; e.parent !== null;) {
					if (this.#f.has(e)) {
						t = !0;
						break;
					}
					e = e.parent;
				}
				if (!t) return !0;
			}
			return !1;
		}
		skip_effect(e) {
			this.#f.has(e) || this.#f.set(e, {
				d: [],
				m: []
			}), this.#p.delete(e);
		}
		unskip_effect(e, t = (e) => this.schedule(e)) {
			var n = this.#f.get(e);
			if (n) {
				this.#f.delete(e);
				for (var r of n.d) N(r, C), t(r);
				for (r of n.m) N(r, w), t(r);
			}
			this.#p.add(e);
		}
		#g() {
			this.#e = !0, Tn++ > 1e3 && (this.#S(), ln());
			for (let e of this.#u) this.#d.delete(e), N(e, C), this.schedule(e);
			for (let e of this.#d) N(e, w), this.schedule(e);
			let t = this.#c;
			this.#c = [], this.apply();
			var n = Cn = [], r = [], i = wn = [];
			for (let e of t) try {
				this.#_(e, n, r);
			} catch (t) {
				throw hn(e), this.#h() || this.discard(), t;
			}
			if (P = null, i.length > 0) {
				var a = e.ensure();
				for (let e of i) a.schedule(e);
			}
			if (Cn = null, wn = null, this.#h()) {
				this.#b(r), this.#b(n);
				for (let [e, t] of this.#f) mn(e, t);
				i.length > 0 && P.#g();
				return;
			}
			let o = this.#v();
			if (o) {
				this.#b(r), this.#b(n), o.#y(this);
				return;
			}
			this.#u.clear(), this.#d.clear();
			for (let e of this.#r) e(this);
			this.#r.clear(), vn = this, un(r), un(n), vn = null, this.#s?.resolve();
			var s = P;
			if (this.#a === 0 && (this.#c.length === 0 || s !== null) && (this.#S(), tt && (this.#x(), P = s)), this.#c.length > 0) if (s !== null) {
				let e = s;
				e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
			} else s = this;
			s !== null && s.#g();
		}
		#_(e, t, n) {
			e.f ^= S;
			for (var r = e.first; r !== null;) {
				var i = r.f, a = (i & 96) != 0;
				if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
					a ? r.f ^= S : i & 4 ? t.push(r) : tt && i & 16777224 ? n.push(r) : Ur(r) && (i & 16 && this.#d.add(r), Jr(r));
					var o = r.first;
					if (o !== null) {
						r = o;
						continue;
					}
				}
				for (; r !== null;) {
					var s = r.next;
					if (s !== null) {
						r = s;
						break;
					}
					r = r.parent;
				}
			}
		}
		#v() {
			for (var e = this.#t; e !== null;) {
				if (!e.is_fork) {
					for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
				}
				e = e.#t;
			}
			return null;
		}
		#y(e) {
			for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
			for (let [t, n] of e.async_deriveds) {
				let e = this.async_deriveds.get(t);
				e && n.promise.then(e.resolve).catch(e.reject);
			}
			e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
			let t = (e) => {
				var n = e.reactions;
				if (n !== null) for (let e of n) {
					var r = e.f;
					if (r & 2) t(e);
					else {
						var i = e;
						r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), N(i, C), this.schedule(i));
					}
				}
			};
			for (let e of this.current.keys()) t(e);
			this.oncommit(() => e.discard()), e.#S(), P = this, this.#g();
		}
		#b(e) {
			for (var t = 0; t < e.length; t += 1) Ct(e[t], this.#u, this.#d);
		}
		capture(e, t, n = !1) {
			e.v !== E && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), yn?.set(e, t)), this.is_fork || (e.v = t);
		}
		activate() {
			P = this;
		}
		deactivate() {
			P = null, yn = null;
		}
		flush() {
			try {
				Sn = !0, P = this, this.#g();
			} finally {
				Tn = 0, bn = null, Cn = null, wn = null, Sn = !1, P = null, yn = null, Rn.clear();
			}
		}
		discard() {
			for (let e of this.#i) e(this);
			this.#i.clear();
			for (let e of this.async_deriveds.values()) e.reject(on);
			this.#S(), this.#s?.resolve();
		}
		register_created_effect(e) {
			this.#l.push(e);
		}
		#x() {
			for (let u = gn; u !== null; u = u.#n) {
				var e = u.id < this.id, t = [];
				for (let [r, [i, a]] of this.current) {
					if (u.current.has(r)) {
						var n = u.current.get(r)[0];
						if (e && i !== n) u.current.set(r, [i, a]);
						else continue;
					}
					t.push(r);
				}
				if (e) for (let [e, t] of this.async_deriveds) {
					let n = u.async_deriveds.get(e);
					n && t.promise.then(n.resolve).catch(n.reject);
				}
				var r = [...u.current.keys()].filter((e) => !u.current.get(e)[1]);
				if (!(!u.#e || r.length === 0)) {
					var i = r.filter((e) => !this.current.has(e));
					if (i.length === 0) e && u.discard();
					else if (t.length > 0) {
						if (e) for (let e of this.#p) u.unskip_effect(e, (e) => {
							e.f & 4194320 ? u.schedule(e) : u.#b([e]);
						});
						u.activate();
						var a = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
						for (var s of t) dn(s, i, a, o);
						o = /* @__PURE__ */ new Map();
						var c = [...u.current].filter(([e, t]) => {
							let n = this.current.get(e);
							return !n || n[0] !== t[0] || n[1] !== t[1];
						}).map(([e]) => e);
						if (c.length > 0) for (let e of this.#l) !(e.f & 155648) && fn(e, c, o) && (e.f & 4194320 ? (N(e, C), u.schedule(e)) : u.#u.add(e));
						if (u.#c.length > 0 && !u.#m) {
							u.apply();
							for (var l of u.#c) u.#_(l, [], []);
							u.#c = [];
						}
						u.deactivate();
					}
				}
			}
		}
		increment(e, t) {
			if (this.#a += 1, e) {
				let e = this.#o.get(t) ?? 0;
				this.#o.set(t, e + 1);
			}
		}
		decrement(e, t) {
			if (--this.#a, e) {
				let e = this.#o.get(t) ?? 0;
				e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
			}
			this.#m || (this.#m = !0, ft(() => {
				this.#m = !1, this.linked && this.flush();
			}));
		}
		transfer_effects(e, t) {
			for (let t of e) this.#u.add(t);
			for (let e of t) this.#d.add(e);
			e.clear(), t.clear();
		}
		oncommit(e) {
			this.#r.add(e);
		}
		ondiscard(e) {
			this.#i.add(e);
		}
		settled() {
			return (this.#s ??= s()).promise;
		}
		static ensure() {
			if (P === null) {
				let t = P = new e();
				!Sn && !xn && ft(() => {
					t.#e || t.flush();
				});
			}
			return P;
		}
		apply() {
			if (!tt || !this.is_fork && this.#t === null && this.#n === null) {
				yn = null;
				return;
			}
			yn = /* @__PURE__ */ new Map();
			for (let [e, [t]] of this.current) yn.set(e, t);
			for (let t = gn; t !== null; t = t.#n) if (!(t === this || t.is_fork)) {
				var e = !1;
				if (t.id < this.id) {
					for (let [n, [, r]] of t.current) if (!r && this.current.has(n)) {
						e = !0;
						break;
					}
				}
				if (!e) for (let [e, n] of t.previous) yn.has(e) || yn.set(e, n);
			}
		}
		schedule(e) {
			if (bn = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
				e.b.defer_effect(e);
				return;
			}
			for (var t = e; t.parent !== null;) {
				t = t.parent;
				var n = t.f;
				if (Cn !== null && t === U && (tt || (H === null || !(H.f & 2)) && !Pt)) return;
				if (n & 96) {
					if (!(n & 1024)) return;
					t.f ^= S;
				}
			}
			this.#c.push(t);
		}
		#S() {
			if (this.linked) {
				var e = this.#t, t = this.#n;
				e === null ? gn = t : e.#n = t, t === null ? _n = e : t.#t = e, this.linked = !1;
			}
		}
	}, On = null;
}));
function An(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Xe,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function jn(e, t) {
	let n = An(e, t);
	return zr(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Mn(e, t = !1, n = !0) {
	let r = An(e);
	return t || (r.equals = Qe), nt && n && j !== null && j.l !== null && (j.l.s ??= []).push(r), r;
}
function F(e, t, n = !1) {
	return H !== null && (!ri || H.f & 131072) && ut() && H.f & 4325394 && (ii === null || !ii.has(e)) && Me(), Nn(e, n ? Bn(t) : t, wn);
}
function Nn(e, t, n = null) {
	if (!e.equals(t)) {
		Rn.set(e, ni ? t : e.v);
		var r = Dn.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && tn(t), yn === null && yt(t);
		}
		e.wv = Hr(), In(e, C, n), ut() && U !== null && U.f & 1024 && !(U.f & 96) && (si === null ? Br([e]) : si.push(e)), !r.is_fork && Ln.size > 0 && !zn && Pn();
	}
	return t;
}
function Pn() {
	zn = !1;
	for (let e of Ln) {
		e.f & 1024 && N(e, w);
		let t;
		try {
			t = Ur(e);
		} catch {
			t = !0;
		}
		t && Jr(e);
	}
	Ln.clear();
}
function Fn(e) {
	F(e, e.v + 1);
}
function In(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = ut(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === U)) {
			var l = (c & C) === 0;
			if (l && N(s, t), c & 131072) Ln.add(s);
			else if (c & 2) {
				var u = s;
				yn?.delete(u), c & 65536 || (c & 512 && (U === null || !(U.f & 2097152)) && (s.f |= ce), In(u, w, n));
			} else if (l) {
				var d = s;
				c & 16 && On !== null && On.add(d), n === null ? pn(d) : n.push(d);
			}
		}
	}
}
var Ln, Rn, zn, I = t((() => {
	a(), W(), $e(), T(), Pe(), rt(), at(), ot(), M(), kn(), Vn(), sn(), xt(), Ln = /* @__PURE__ */ new Set(), Rn = /* @__PURE__ */ new Map(), zn = !1;
}));
//#endregion
//#region node_modules/svelte/src/internal/client/proxy.js
function Bn(e) {
	if (typeof e != "object" || !e || fe in e) return e;
	let t = _(e);
	if (t !== h && t !== g) return e;
	var n = /* @__PURE__ */ new Map(), r = c(e), i = /* @__PURE__ */ jn(0), a = null, o = ui, s = (e) => {
		if (ui === o) return e();
		var t = H, n = ui;
		Lr(null), Vr(o);
		var r = e();
		return Lr(t), Vr(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ jn(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && Ae();
			var i = n.get(t);
			return i === void 0 ? s(() => {
				var e = /* @__PURE__ */ jn(r.value, a);
				return n.set(t, e), e;
			}) : F(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = s(() => /* @__PURE__ */ jn(E, a));
					n.set(t, e), Fn(i);
				}
			} else F(r, E), Fn(i);
			return !0;
		},
		get(t, r, i) {
			if (r === fe) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || p(t, r)?.writable) && (o = s(() => /* @__PURE__ */ jn(Bn(c ? t[r] : E), a)), n.set(r, o)), o !== void 0) {
				var l = V(o);
				return l === E ? void 0 : l;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var r = Reflect.getOwnPropertyDescriptor(e, t);
			if (r && "value" in r) {
				var i = n.get(t);
				i && (r.value = V(i));
			} else if (r === void 0) {
				var a = n.get(t), o = a?.v;
				if (a !== void 0 && o !== E) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return r;
		},
		has(e, t) {
			if (t === fe) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== E || Reflect.has(e, t);
			return (r !== void 0 || U !== null && (!i || p(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ jn(i ? Bn(e[t]) : E, a)), n.set(t, r)), V(r) === E) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ jn(E, a)), n.set(d + "", f)) : F(f, E);
			}
			if (l === void 0) (!u || p(e, t)?.writable) && (l = s(() => /* @__PURE__ */ jn(void 0, a)), F(l, Bn(o)), n.set(t, l));
			else {
				u = l.v !== E;
				var m = s(() => Bn(o));
				F(l, m);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var g = n.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && F(g, _ + 1);
				}
				Fn(i);
			}
			return !0;
		},
		ownKeys(e) {
			V(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== E;
			});
			for (var [r, a] of n) a.v !== E && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			je();
		}
	});
}
var Vn = t((() => {
	a(), W(), b(), I(), T(), ze(), Pe(), at(), ot(), rt();
})), Hn = t((() => {
	Ue(), Vn();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/operations.js
function Un() {
	if (Qn === void 0) {
		Qn = window, $n = document, er = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		tr = p(t, "firstChild").get, nr = p(t, "nextSibling").get, v(e) && (e[ge] = void 0, e[he] = null, e[_e] = void 0, e.__e = void 0), v(n) && (n[ve] = void 0);
	}
}
function Wn(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Gn(e) {
	return tr.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function Kn(e) {
	return nr.call(e);
}
function L(e, t) {
	if (!O) return /* @__PURE__ */ Gn(e);
	var n = /* @__PURE__ */ Gn(k);
	if (n === null) n = k.appendChild(Wn());
	else if (t && n.nodeType !== 3) {
		var r = Wn();
		return n?.before(r), Ge(r), r;
	}
	return t && Zn(n), Ge(n), n;
}
function qn(e, t = !1) {
	if (!O) {
		var n = /* @__PURE__ */ Gn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Kn(n) : n;
	}
	if (t) {
		if (k?.nodeType !== 3) {
			var r = Wn();
			return k?.before(r), Ge(r), r;
		}
		Zn(k);
	}
	return k;
}
function R(e, t = 1, n = !1) {
	let r = O ? k : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ Kn(r);
	if (!O) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = Wn();
			return r === null ? i?.after(a) : r.before(a), Ge(a), a;
		}
		Zn(r);
	}
	return Ge(r), r;
}
function Jn(e) {
	e.textContent = "";
}
function Yn() {
	return !tt || On !== null ? !1 : (U.f & ne) !== 0;
}
function Xn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function Zn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
var Qn, $n, er, tr, nr, z = t((() => {
	A(), a(), Hn(), b(), W(), rt(), T(), kn(), ze();
})), rr = t((() => {
	A(), z(), ht(), T();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ir(e) {
	var t = H, n = U;
	Lr(null), Rr(null);
	try {
		return e();
	} finally {
		Lr(t), Rr(n);
	}
}
var ar = t((() => {
	B(), W(), T(), rr();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function or(e) {
	U === null && (H === null && De(e), Ee()), ni && Te(e);
}
function sr(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function cr(e, t) {
	var n = U;
	n !== null && n.f & 8192 && (e |= ee);
	var r = {
		ctx: j,
		deps: null,
		nodes: null,
		f: e | C | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	P?.register_created_effect(r);
	var i = r;
	if (e & 4) Cn === null ? Dn.ensure().schedule(r) : Cn.push(r);
	else if (t !== null) {
		try {
			Jr(r);
		} catch (e) {
			throw Er(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ie));
	}
	if (i !== null && (i.parent = n, n !== null && sr(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function lr() {
	return H !== null && !ri;
}
function ur(e) {
	let t = cr(8, null);
	return N(t, S), t.teardown = e, t;
}
function dr(e) {
	or("$effect");
	var t = U.f;
	if (!H && t & 32 && j !== null && !j.i) {
		var n = j;
		(n.e ??= []).push(e);
	} else return fr(e);
}
function fr(e) {
	return cr(4 | oe, e);
}
function pr(e) {
	return or("$effect.pre"), cr(8 | oe, e);
}
function mr(e) {
	Dn.ensure();
	let t = cr(64 | ae, e);
	return () => {
		Er(t);
	};
}
function hr(e) {
	Dn.ensure();
	let t = cr(64 | ae, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? kr(t, () => {
			Er(t), n(void 0);
		}) : (Er(t), n(void 0));
	});
}
function gr(e) {
	return cr(4, e);
}
function _r(e) {
	return cr(ue | ae, e);
}
function vr(e, t = 0) {
	return cr(8 | t, e);
}
function yr(e, t = [], n = [], r = []) {
	Gt(r, t, n, (t) => {
		cr(8, () => {
			e(...t.map(V));
		});
	});
}
function br(e, t = 0) {
	return cr(16 | t, e);
}
function xr(e, t = 0) {
	return cr(x | t, e);
}
function Sr(e) {
	return cr(32 | ae, e);
}
function Cr(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = ni, n = H;
		Ir(!0), Lr(null);
		try {
			t.call(null);
		} finally {
			Ir(e), Lr(n);
		}
	}
}
function wr(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ir(() => {
			e.abort(ye);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Er(n, t), n = r;
	}
}
function Tr(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Er(t), t = n;
	}
}
function Er(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Dr(e.nodes.start, e.nodes.end), n = !0), e.f |= re, wr(e, t && !n), qr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Cr(e), e.f ^= re, e.f |= te;
	var i = e.parent;
	i !== null && i.first !== null && Or(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Dr(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Kn(e);
		e.remove(), e = n;
	}
}
function Or(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function kr(e, t, n = !0) {
	var r = [];
	Ar(e, r, !0);
	var i = () => {
		n && Er(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function Ar(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ee;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = (i.f & 65536) != 0 || (i.f & 32) != 0 && (e.f & 16) != 0;
				Ar(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function jr(e) {
	Mr(e, !0);
}
function Mr(e, t) {
	if (e.f & 8192) {
		e.f ^= ee, e.f & 1024 || (N(e, C), Dn.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = (n.f & 65536) != 0 || (n.f & 32) != 0;
			Mr(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Nr(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ Kn(n);
		t.append(n), n = i;
	}
}
var B = t((() => {
	W(), T(), Pe(), a(), b(), z(), M(), kn(), Yt(), ar(), xt();
})), Pr, Fr = t((() => {
	I(), W(), Pr = null;
}));
//#endregion
//#region node_modules/svelte/src/internal/client/runtime.js
function Ir(e) {
	ni = e;
}
function Lr(e) {
	H = e;
}
function Rr(e) {
	U = e;
}
function zr(e) {
	H !== null && (!tt || H.f & 2) && (ii ??= /* @__PURE__ */ new Set()).add(e);
}
function Br(e) {
	si = e;
}
function Vr(e) {
	ui = e;
}
function Hr() {
	return ++ci;
}
function Ur(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~ce), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Ur(a) && nn(a), a.wv > e.wv) return !0;
		}
		t & 512 && yn === null && N(e, S);
	}
	return !1;
}
function Wr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(!tt && ii !== null && ii.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Wr(a, t, !1) : t === a && (n ? N(a, C) : a.f & 1024 && N(a, w), pn(a));
	}
}
function Gr(e) {
	var t = ai, n = oi, r = si, i = H, a = ii, o = j, s = ri, c = ui, l = e.f;
	ai = null, oi = 0, si = null, H = l & 96 ? null : e, ii = null, st(e.ctx), ri = !1, ui = ++li, e.ac !== null && (ir(() => {
		e.ac.abort(ye);
	}), e.ac = null);
	try {
		e.f |= le;
		var u = e.fn, d = u();
		e.f |= ne;
		var f = e.deps, p = P?.is_fork;
		if (ai !== null) {
			var m;
			if (p || qr(e, oi), f !== null && oi > 0) for (f.length = oi + ai.length, m = 0; m < ai.length; m++) f[oi + m] = ai[m];
			else e.deps = f = ai;
			if (lr() && e.f & 512) for (m = oi; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && oi < f.length && (qr(e, oi), f.length = oi);
		if (ut() && si !== null && !ri && f !== null && !(e.f & 6146)) for (m = 0; m < si.length; m++) Wr(si[m], e);
		if (i !== null && i !== e) {
			if (li++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = li;
			if (t !== null) for (let e of t) e.rv = li;
			si !== null && (r === null ? r = si : r.push(...si));
		}
		return e.f & 8388608 && (e.f ^= de), d;
	} catch (e) {
		return gt(e);
	} finally {
		e.f ^= le, ai = t, oi = n, si = r, H = i, ii = a, st(o), ri = s, ui = c;
	}
}
function Kr(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = l.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (ai === null || !u.call(ai, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512, a.f &= ~ce), a.v !== E && yt(a), rn(a), qr(a, 0);
	}
}
function qr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Kr(e, n[r]);
}
function Jr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		N(e, S);
		var n = U, r = ti;
		U = e, ti = !0;
		try {
			t & 16777232 ? Tr(e) : wr(e), Cr(e);
			var i = Gr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = ci;
		} finally {
			ti = r, U = n;
		}
	}
}
async function Yr() {
	if (tt) return new Promise((e) => {
		requestAnimationFrame(() => e()), setTimeout(() => e());
	});
	await Promise.resolve(), cn();
}
function V(e) {
	var t = (e.f & 2) != 0;
	if (Pr?.add(e), H !== null && !ri && !(U !== null && U.f & 16384) && (ii === null || !ii.has(e))) {
		var n = H.deps;
		if (H.f & 2097152) e.rv < li && (e.rv = li, ai === null && n !== null && n[oi] === e ? oi++ : ai === null ? ai = [e] : ai.push(e));
		else {
			H.deps ??= [], u.call(H.deps, e) || H.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [H] : u.call(r, H) || r.push(H);
		}
	}
	if (ni && Rn.has(e)) return Rn.get(e);
	if (t) {
		var i = e;
		if (ni) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Zr(i)) && (a = tn(i)), Rn.set(i, a), a;
		}
		var o = (i.f & 512) == 0 && !ri && H !== null && (ti || (H.f & 512) != 0), s = (i.f & ne) === 0;
		Ur(i) && (o && (i.f |= 512), nn(i)), o && !s && (an(i), Xr(i));
	}
	if (yn?.has(e)) return yn.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Xr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (an(t), Xr(t));
}
function Zr(e) {
	if (e.v === E) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Rn.has(t) || t.f & 2 && Zr(t)) return !0;
	return !1;
}
function Qr(e) {
	var t = ri;
	try {
		return ri = !0, e();
	} finally {
		ri = t;
	}
}
function $r(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (fe in e) ei(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && fe in n && ei(n);
		}
	}
}
function ei(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			ei(e[n], t);
		} catch {}
		let n = _(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = m(n);
			for (let n in t) {
				let r = t[n].get;
				if (r) try {
					r.call(e);
				} catch {}
			}
		}
	}
}
var ti, ni, H, ri, U, ii, ai, oi, si, ci, li, ui, W = t((() => {
	a(), b(), B(), T(), I(), sn(), rt(), at(), ot(), M(), kn(), vt(), ze(), Fr(), ar(), xt(), Ue(), ti = !1, ni = !1, H = null, ri = !1, U = null, ii = null, ai = null, oi = 0, si = null, ci = 1, li = 0, ui = li;
})), di = t((() => {
	Y(), To(), B();
}));
function fi(e) {
	return mi.includes(e);
}
var pi, mi, hi, gi = t((() => {
	pi = /* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split("."), [...pi], mi = ["touchstart", "touchmove"], hi = [
		"$state",
		"$state.raw",
		"$derived",
		"$derived.by"
	], [...hi];
})), _i = t((() => {
	T(), gi(), W();
})), vi = t((() => {
	T(), A(), M();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
function yi(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Si.call(t, e), !e.cancelBubble) return ir(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? ft(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function bi(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = yi(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && ur(() => {
		t.removeEventListener(e, o, a);
	});
}
function G(e, t, n) {
	(t[Ci] ??= {})[e] = n;
}
function xi(e) {
	for (var t = 0; t < e.length; t++) wi.add(e[t]);
	for (var n of Ti) n(e);
}
function Si(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Ei = e;
	var o = 0, s = Ei === e && e[Ci];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[Ci] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		f(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = H, d = U;
		Lr(null), Rr(null);
		try {
			for (var p, m = []; a !== null && a !== t;) {
				try {
					var h = a[Ci]?.[r];
					h != null && (!a.disabled || e.target === a) && h.call(a, e);
				} catch (e) {
					p ? m.push(e) : p = e;
				}
				if (e.cancelBubble) break;
				o++, a = o < i.length ? i[o] : null;
			}
			if (p) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw p;
			}
		} finally {
			e[Ci] = t, delete e.currentTarget, Lr(u), Rr(d);
		}
	}
}
var Ci, wi, Ti, Ei, Di = t((() => {
	B(), b(), A(), ht(), W(), ar(), Ci = Symbol("events"), wi = /* @__PURE__ */ new Set(), Ti = /* @__PURE__ */ new Set(), Ei = null;
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
function Oi(e) {
	return Ai?.createHTML(e) ?? e;
}
function ki(e) {
	var t = Xn("template");
	return t.innerHTML = Oi(e.replaceAll("<!>", "<!---->")), t.content;
}
var Ai, ji = t((() => {
	z(), Ai = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Mi(e, t) {
	var n = U;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function Ni(e, t) {
	var n = (t & 1) != 0, r = (t & 2) != 0, i, a = !e.startsWith("<!>");
	return () => {
		if (O) return Mi(k, null), k;
		i === void 0 && (i = ki(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Gn(i)));
		var t = r || er ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Gn(t), s = t.lastChild;
			Mi(o, s);
		} else Mi(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Pi(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = (t & 1) != 0, a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (O) return Mi(k, null), k;
		if (!o) {
			var e = /* @__PURE__ */ Gn(ki(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ Gn(e);) o.appendChild(/* @__PURE__ */ Gn(e));
			else o = /* @__PURE__ */ Gn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ Gn(t), r = t.lastChild;
			Mi(n, r);
		} else Mi(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Fi(e, t) {
	return /* @__PURE__ */ Pi(e, t, "svg");
}
function Ii() {
	if (O) return Mi(k, null), k;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = Wn();
	return e.append(t, n), Mi(t, n), e;
}
function K(e, t) {
	if (O) {
		var n = U;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = k), Ke();
		return;
	}
	e !== null && e.before(t);
}
var Li = t((() => {
	A(), z(), ji(), W(), ze(), T();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/render.js
function q(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ve] ??= e.nodeValue) && (e[ve] = n, e.nodeValue = `${n}`);
}
function Ri(e, t) {
	return zi(e, t);
}
function zi(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	Un();
	var c = void 0, l = hr(() => {
		var l = n ?? t.appendChild(Wn());
		Vt(l, { pending: () => {} }, (t) => {
			ct({});
			var n = j;
			if (a && (n.c = a), i && (r.$$events = i), O && Mi(t, null), Bi = o, c = e(t, r) || {}, Bi = !0, O && (U.nodes.end = k, k === null || k.nodeType !== 8 || k.data !== "]")) throw Ve(), Fe;
			lt();
		}, s);
		var u = /* @__PURE__ */ new Set(), f = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = fi(r);
					for (let e of [t, document]) {
						var a = Vi.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Vi.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Si, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return f(d(wi)), Ti.add(f), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Vi.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Si), r.delete(e), r.size === 0 && Vi.delete(n)) : r.set(e, i);
			}
			Ti.delete(f), l !== n && l.parentNode?.removeChild(l);
		};
	});
	return Hi.set(c, l), c;
}
var Bi, Vi, Hi, Ui = t((() => {
	a(), z(), ze(), W(), M(), B(), A(), b(), Di(), Ue(), Pe(), Li(), gi(), T(), Wt(), Vi = /* @__PURE__ */ new Map(), Hi = /* @__PURE__ */ new WeakMap();
})), Wi = t((() => {
	T(), A(), B(), I(), Ui(), W();
})), Gi = t((() => {
	b(), T(), M(), gi();
})), Ki = t((() => {
	Pe(), M();
})), qi = t((() => {
	it(), B(), W(), ot();
})), Ji = t((() => {
	Yt(), W(), A(), Li();
})), Yi = t((() => {
	Pe();
})), Xi, Zi = t((() => {
	kn(), B(), T(), A(), z(), a(), Xi = class {
		anchor;
		#e = /* @__PURE__ */ new Map();
		#t = /* @__PURE__ */ new Map();
		#n = /* @__PURE__ */ new Map();
		#r = /* @__PURE__ */ new Set();
		#i = !0;
		constructor(e, t = !0) {
			this.anchor = e, this.#i = t;
		}
		#a = (e) => {
			if (this.#e.has(e)) {
				var t = this.#e.get(e), n = this.#t.get(t);
				if (n) jr(n), this.#r.delete(t);
				else {
					var r = this.#n.get(t);
					r && (jr(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
				}
				for (let [t, n] of this.#e) {
					if (this.#e.delete(t), t === e) break;
					let r = this.#n.get(n);
					r && (Er(r.effect), this.#n.delete(n));
				}
				for (let [e, r] of this.#t) {
					if (e === t || this.#r.has(e)) continue;
					let i = () => {
						if (Array.from(this.#e.values()).includes(e)) {
							var t = document.createDocumentFragment();
							Nr(r, t), t.append(Wn()), this.#n.set(e, {
								effect: r,
								fragment: t
							});
						} else Er(r);
						this.#r.delete(e), this.#t.delete(e);
					};
					this.#i || !n ? (this.#r.add(e), kr(r, i, !1)) : i();
				}
			}
		};
		#o = (e) => {
			this.#e.delete(e);
			let t = Array.from(this.#e.values());
			for (let [e, n] of this.#n) t.includes(e) || (Er(n.effect), this.#n.delete(e));
		};
		ensure(e, t) {
			var n = P, r = Yn();
			if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
				var i = document.createDocumentFragment(), a = Wn();
				i.append(a), this.#n.set(e, {
					effect: Sr(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Sr(() => t(this.anchor)));
			if (this.#e.set(n, e), r) {
				for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
				for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
				n.oncommit(this.#a), n.ondiscard(this.#o);
			} else O && (this.anchor = k), this.#a(n);
		}
	};
})), Qi = t((() => {
	b(), B(), I(), A(), ht(), M(), kn(), Zi(), Yt();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function $i(e, t, n = !1) {
	var r;
	O && (r = k, Ke());
	var i = new Xi(e), a = n ? ie : 0;
	function o(e, t) {
		if (O) {
			var n = Ye(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Je();
				Ge(a), i.anchor = a, We(!1), i.ensure(e, t), We(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	br(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
var ea = t((() => {
	T(), A(), B(), Zi();
})), ta = t((() => {
	M(), B(), A(), Zi();
})), na = t((() => {
	B(), A(), z();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function ra(e, t) {
	return t;
}
function ia(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		kr(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					aa(e, d(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null;
		if (c) {
			var l = n, u = l.parentNode;
			Jn(u), u.append(l), e.items.clear();
		}
		aa(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function aa(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= se, Nr(a, document.createDocumentFragment())) : Er(t[i], n);
	}
}
function oa(e, t, n, r, i, a = null) {
	var o = e, s = /* @__PURE__ */ new Map();
	if (t & 4) {
		var l = e;
		o = O ? Ge(/* @__PURE__ */ Gn(l)) : l.appendChild(Wn());
	}
	O && Ke();
	var u = null, f = /* @__PURE__ */ $t(() => {
		var e = n();
		return c(e) ? e : e == null ? [] : d(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = u, ca(v, p, o, t, r), u !== null && (p.length === 0 ? u.f & 33554432 ? (u.f ^= se, ua(u, null, o)) : jr(u) : kr(u, () => {
			u = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: br(() => {
			p = V(f);
			var e = p.length;
			let c = !1;
			O && Ye(o) === "[!" != (e === 0) && (o = Je(), Ge(o), We(!1), c = !0);
			for (var l = /* @__PURE__ */ new Set(), d = P, v = Yn(), y = 0; y < e; y += 1) {
				O && k.nodeType === 8 && k.data === "]" && (o = k, c = !0, We(!1));
				var b = p[y], x = r(b, y), S = h ? null : s.get(x);
				S ? (S.v && Nn(S.v, b), S.i && Nn(S.i, y), v && d.unskip_effect(S.e)) : (S = la(s, h ? o : fa ??= Wn(), b, x, y, i, t, n), h || (S.e.f |= se), s.set(x, S)), l.add(x);
			}
			if (e === 0 && a && !u && (h ? u = Sr(() => a(o)) : (u = Sr(() => a(fa ??= Wn())), u.f |= se)), e > l.size && we("", "", ""), O && e > 0 && Ge(Je()), !h) if (m.set(d, l), v) {
				for (let [e, t] of s) l.has(e) || d.skip_effect(t.e);
				d.oncommit(g), d.ondiscard(_);
			} else g(d);
			c && We(!0), V(f);
		}),
		flags: t,
		items: s,
		pending: m,
		outrogroups: null,
		fallback: u
	};
	h = !1, O && (o = k);
}
function sa(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function ca(e, t, n, r, i) {
	var a = (r & 8) != 0, o = t.length, s = e.items, c = sa(e.effect.first), l, u = null, f, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (f ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (jr(_), a && (_.nodes?.a?.unfix(), (f ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= se, _ === c) ua(_, null, n);
		else {
			var y = u ? u.next : c;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), da(e, u, _), da(e, _, y), ua(_, y, n), u = _, p = [], m = [], c = sa(u.next);
			continue;
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					u = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) ua(p[x], b, n);
					for (x = 0; x < m.length; x += 1) l.delete(m[x]);
					da(e, S.prev, C.next), da(e, u, S), da(e, C, b), c = b, u = C, --v, p = [], m = [];
				} else l.delete(_), ua(_, c, n), da(e, _.prev, _.next), da(e, _, u === null ? e.effect.first : u.next), da(e, u, _), u = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = sa(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), u = _, c = sa(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (aa(e, d(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var w = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || w.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && w.push(c), c = sa(c.next);
		var ee = w.length;
		if (ee > 0) {
			var te = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			ia(e, w, te);
		}
	}
	a && ft(() => {
		if (f !== void 0) for (_ of f) _.nodes?.a?.apply();
	});
}
function la(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? An(n) : /* @__PURE__ */ Mn(n, !1, !1) : null, l = o & 2 ? An(i) : null;
	return {
		v: c,
		i: l,
		e: Sr(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function ua(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ Kn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function da(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
var fa, pa = t((() => {
	ze(), A(), z(), B(), I(), b(), T(), ht(), W(), a(), sn(), kn(), Pe(), at();
}));
function ma(e, t, n = !1, r = !1, i = !1, a = !1) {
	var o = e, s = "";
	if (n) {
		var c = e;
		O && (o = Ge(/* @__PURE__ */ Gn(c)));
	}
	yr(() => {
		var e = U;
		if (s === (s = t() ?? "")) {
			O && Ke();
			return;
		}
		if (n && !O) {
			e.nodes = null, c.innerHTML = s, s !== "" && Mi(/* @__PURE__ */ Gn(c), c.lastChild);
			return;
		}
		if (e.nodes !== null && (Dr(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (O) {
				for (var a = k.data, l = Ke(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ Kn(l);
				if (l === null) throw Ve(), Fe;
				Mi(k, u), o = Ge(l);
				return;
			}
			var d = Xn(r ? "svg" : i ? "math" : "template", r ? Le : i ? Re : void 0);
			d.innerHTML = s;
			var f = r || i ? d : d.content;
			if (Mi(/* @__PURE__ */ Gn(f), f.lastChild), r || i) for (; /* @__PURE__ */ Gn(f);) o.before(/* @__PURE__ */ Gn(f));
			else o.before(f);
		}
	});
}
var ha = t((() => {
	ze(), B(), A(), Li(), Ue(), gi(), a(), M(), z(), W(), T();
})), ga = t((() => {
	A();
})), _a = t((() => {
	gi(), Se();
})), va = t((() => {
	T(), B(), M(), A(), ji(), Li(), Pe(), z(), _a(), Zi();
})), ya = t((() => {
	T(), B(), A(), Zi();
})), ba, xa, Sa = t((() => {
	b(), a(), ba = () => performance.now(), xa = {
		tick: (e) => requestAnimationFrame(e),
		now: () => ba(),
		tasks: /* @__PURE__ */ new Set()
	};
}));
//#endregion
//#region node_modules/svelte/src/internal/client/loop.js
function Ca() {
	let e = xa.now();
	xa.tasks.forEach((t) => {
		t.c(e) || (xa.tasks.delete(t), t.f());
	}), xa.tasks.size !== 0 && xa.tick(Ca);
}
function wa(e) {
	let t;
	return xa.tasks.size === 0 && xa.tick(Ca), {
		promise: new Promise((n) => {
			xa.tasks.add(t = {
				c: e,
				f: n
			});
		}),
		abort() {
			xa.tasks.delete(t);
		}
	};
}
var Ta = t((() => {
	Sa();
})), Ea = t((() => {
	b(), B(), W(), Ta(), Ui(), T(), ht(), ar();
})), Da = t((() => {
	A(), z(), B(), Ui(), W(), M(), T(), Li(), gi(), Zi(), Ea();
})), Oa = t((() => {
	A(), z(), B(), T();
})), ka = t((() => {
	B(), z();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function Aa(e, t, n) {
	gr(() => {
		var r = Qr(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			vr(() => {
				var e = n();
				$r(e), i && Ze(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
var ja = t((() => {
	B(), $e(), W();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function Ma(e, t) {
	var n = void 0, r;
	xr(() => {
		n !== (n = t()) && (r &&= (Er(r), null), n && (r = Sr(() => {
			gr(() => n(e));
		})));
	});
}
var Na = t((() => {
	B();
}));
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function Pa(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Ra.includes(r[o - 1])) && (s === r.length || Ra.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Fa(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Ia(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function La(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Ia)), i && c.push(...Object.keys(i).map(Ia));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Ia(e.substring(l, u).trim());
							if (!c.includes(p)) {
								f !== ";" && d++;
								var m = e.substring(l, d).trim();
								n += " " + m + ";";
							}
						}
						l = d + 1, u = -1;
					}
				}
			}
		}
		return r && (n += Fa(r)), i && (n += Fa(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
var Ra, za = t((() => {
	b(), Ra = [..." 	\n\r\f\xA0\v﻿"];
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Ba(e, t, n, r, i, a) {
	var o = e[ge];
	if (O || o !== n || o === void 0) {
		var s = Pa(n, r, a);
		(!O || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ge] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
var Va = t((() => {
	za(), T(), A();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function Ha(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Ua(e, t, n, r) {
	var i = e[_e];
	if (O || i !== t) {
		var a = La(t, r);
		(!O || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[_e] = t;
	} else r && (Array.isArray(r) ? (Ha(e, n?.[0], r[0]), Ha(e, n?.[1], r[1], "important")) : Ha(e, n, r));
	return r;
}
var Wa = t((() => {
	za(), T(), A();
})), Ga = t((() => {
	B(), ar(), Vn(), b(), kn();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
function J(e, t, n, r) {
	var i = Ka(e);
	O && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Xa) || i[t] !== (i[t] = n) && (t === "loading" && (e[me] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && qa(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function Ka(e) {
	return e[he] ??= {
		[Ja]: e.nodeName.includes("-"),
		[Ya]: e.namespaceURI === Ie
	};
}
function qa(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Za.get(t);
	if (n) return n;
	Za.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = m(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.push(o);
		i = _(i);
	}
	return n;
}
var Ja, Ya, Xa, Za, Qa = t((() => {
	a(), A(), b(), Di(), rr(), Ue(), T(), ht(), gi(), W(), Na(), za(), Va(), Wa(), ze(), B(), Ga(), Yt(), Ja = Symbol("is custom element"), Ya = Symbol("is html"), Xa = be ? "link" : "LINK", Za = /* @__PURE__ */ new Map();
})), $a = t((() => {
	A(), z(), ji(), Na();
})), eo = t((() => {
	ar();
})), to = t((() => {
	B(), ar(), Pe(), Vn(), ht(), A(), W(), kn();
})), no = t((() => {
	B(), ar();
})), ro = t((() => {
	ar();
})), io = t((() => {
	B(), b();
})), ao = t((() => {
	B(), W();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function oo(e, t) {
	return e === t || e?.[fe] === t;
}
function so(e = {}, t, n, r) {
	var i = j.r, a = U;
	return gr(() => {
		var o, s;
		return vr(() => {
			o = s, s = r?.() || [], Qr(() => {
				oo(n(...s), e) || (t(e, ...s), o && oo(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && oo(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
var co = t((() => {
	T(), M(), B(), W();
})), lo = t((() => {
	B(), ar();
})), uo = t((() => {
	B(), ar();
})), fo = t((() => {
	b(), B(), Di();
})), po = t((() => {
	b(), M(), sn(), B(), W();
})), mo = t((() => {
	I(), W(), b();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function ho(e, t, n, r) {
	var i = !nt || (n & 2) != 0, a = (n & 8) != 0, o = (n & 16) != 0, s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ Xt(r), V(l)) : (c && (c = !1, s = o ? Qr(r) : r), s);
	let d;
	if (a) {
		var f = fe in e || pe in e;
		d = p(e, t)?.set ?? (f && t in e ? (n) => e[t] = n : void 0);
	}
	var m, h = !1;
	a ? [m, h] = Nt(() => e[t]) : m = e[t], m === void 0 && r !== void 0 && (m = u(), d && (i && ke(t), d(m)));
	var g = i ? () => {
		var n = e[t];
		return n === void 0 ? u() : (c = !0, n);
	} : () => {
		var n = e[t];
		return n !== void 0 && (s = void 0), n === void 0 ? s : n;
	};
	if (i && !(n & 4)) return g;
	if (d) {
		var _ = e.$$legacy;
		return (function(e, t) {
			return arguments.length > 0 ? ((!i || !t || _ || h) && d(t ? g() : e), e) : g();
		});
	}
	var v = !1, y = (n & 1 ? Xt : $t)(() => (v = !1, g()));
	a && V(y);
	var b = U;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? V(y) : i && a ? Bn(e) : e;
			return F(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return ni && v || b.f & 16384 ? y.v : V(y);
	});
}
var go = t((() => {
	a(), ze(), b(), I(), sn(), W(), Pe(), T(), Vn(), Lt(), rt(), B();
})), _o = t((() => {
	M(), B(), Lt(), Yt();
})), vo = t((() => {
	T(), B(), I(), Ui(), W(), kn(), b(), Pe(), M(), rt(), xt(), fo();
})), yo = t((() => {
	vo(), B(), Li(), b(), z();
})), bo = t((() => {
	T(), it(), W();
})), Y = t((() => {
	di(), ze(), M(), _i(), vi(), Wi(), Gi(), Ki(), at(), qi(), Ji(), Yi(), Qi(), ea(), ta(), na(), pa(), ha(), ga(), va(), ya(), Da(), Oa(), ka(), ja(), Na(), Qa(), Va(), Di(), rr(), $a(), Wa(), Ea(), eo(), to(), no(), ro(), io(), Ga(), ao(), co(), lo(), uo(), A(), fo(), po(), mo(), Li(), Yt(), kn(), sn(), B(), I(), go(), Lt(), Wt(), Fr(), Ui(), W(), _o(), Sa(), Vn(), yo(), z(), za(), it(), b(), _a(), Hn(), bo();
})), xo = t((() => {
	A(), Pe();
}));
//#endregion
//#region node_modules/svelte/src/index-client.js
function So(e) {
	j === null && xe("onMount"), nt && j.l !== null ? wo(j).m.push(e) : dr(() => {
		let t = Qr(e);
		if (typeof t == "function") return t;
	});
}
function Co(e) {
	j === null && xe("onDestroy"), So(() => () => Qr(e));
}
function wo(e) {
	var t = e.l;
	return t.u ??= {
		a: [],
		b: [],
		m: []
	};
}
var To = t((() => {
	W(), b(), Y(), Pe(), rt(), M(), a(), kn(), xo(), Ui(), va();
})), Eo = t((() => {})), Do = t((() => {
	Eo(), typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
})), X, Oo = t((() => {
	Y(), X = Bn({
		locale: document.documentElement.lang,
		reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
		compact: innerWidth <= 720,
		scrollable: !1
	});
}));
//#endregion
//#region src/portfolio/project-details.ts
function ko(e, t, n) {
	let r = document.createElement("article");
	r.id = e.hash, r.className = "mac-extra-project mac-detail", r.dataset.projectDetail = e.id;
	let i = (e, n) => `<${e} data-desktop-text="${n}">${t(n)}</${e}>`, a = ["labware", "easyui"].includes(e.id), o = e.id === "labware" ? "7" : "2", s = a ? `<video controls playsinline preload="metadata" poster="./assets/videos/${e.id}-poster.jpg?v=${o}"><source src="./assets/videos/${e.id}.mp4?v=${o}" type="video/mp4" /></video>` : `<img src="./assets/project-icons/${n}" alt="${e.repo}" loading="lazy" decoding="async" />`, c = Mo[e.id];
	return r.innerHTML = `<header><p class="eyebrow">${e.repo}</p><h2>${t(e.id)}</h2>${i("p", `${e.id}.summary`)}</header>
    <figure class="mac-detail-media ${a ? "" : "mac-detail-brand"}">${s}${i("figcaption", `${e.id}.caption`)}</figure>
    <section>${i("h3", "detail.features")}${i("p", `${e.id}.features`)}</section>
    ${i("p", `${e.id}.note`)}
    <nav class="mac-detail-links">${c ? `<a class="text-link" href="https://jason-chen-coder.github.io/${c}" target="_blank" rel="noopener noreferrer">${i("span", "detail.demo")} ↗</a>` : ""}<a class="text-link" href="https://github.com/Jason-chen-coder/${e.repo}" target="_blank" rel="noopener noreferrer">${i("span", "detail.source")} ↗</a></nav>`, r.querySelector("h2").dataset.desktopText = e.id, r;
}
var Ao, jo, Mo, No = t((() => {
	Ao = {
		labware: {
			summary: ["用对话与表单定义实验室耗材，在同一份数据上检查 JSON、2D 孔位和 3D 结构。", "Define laboratory consumables with conversation and forms, and inspect JSON, 2D well layouts and 3D geometry from the same definition."],
			features: ["表单参数编辑 · 2D / 3D 联动预览 · Definition 导出", "Parameter editing · Linked 2D / 3D previews · Definition export"],
			note: ["在线体验提供表单与本地预览；真实 Agent 对话需要本地前后端服务。", "The online demo provides forms and local previews. Live Agent conversations require the local frontend and backend."],
			caption: ["产品宣传片：耗材结构与模拟创建流程", "Product film: labware structures and the simulated creation workflow"]
		},
		easyui: {
			summary: ["面向 Flutter Web、桌面与移动端的组件工作台，把设计 token、常用交互和示例页面沉淀为可复用的 UI 层。", "A Flutter component workbench for web, desktop and mobile, bringing design tokens, interaction patterns and examples into a reusable UI layer."],
			features: ["表单与数据展示 · 浅色 / 深色主题 · 中英文示例 · AI 视图构建 Skill", "Forms and data display · Light / dark themes · Bilingual examples · AI view-building skill"],
			note: ["打开在线工作台，浏览组件和示例页面，切换主题与语言。", "Open the live workbench to explore components and example pages, and switch themes and languages."],
			caption: ["产品宣传片：组件工作台与主题切换", "Product film: component workbench and theme switching"]
		},
		flutterflow: {
			summary: ["使用 Flutter 构建的流程图工具，探索跨平台画布上的节点编排和连线交互。", "A flowchart tool built with Flutter, exploring node composition and connections on a cross-platform canvas."],
			features: ["Flutter 画布 · 流程图交互 · Web 在线演示", "Flutter canvas · Flowchart interactions · Live web demo"],
			note: ["与 mxGraph 编辑器采用不同的技术路线，可在在线演示中体验。", "Explore a different implementation approach from the mxGraph editor in the live demo."],
			caption: ["Flutter EasyFlow 应用图标", "Flutter EasyFlow app icon"]
		},
		microfrontends: {
			summary: ["Webpack 5 模块联邦、Node.js 与 Nacos 的微前端实践，探索前端模块拆分与服务发现的协作方式。", "A microfrontend experiment with Webpack 5 Module Federation, Node.js and Nacos, exploring frontend module composition and service discovery."],
			features: ["Module Federation · Node.js · Nacos 服务发现", "Module Federation · Node.js · Nacos service discovery"],
			note: ["这是需要配套服务运行的工程案例；查看源码与 README 了解启动方式。", "This engineering example requires supporting services. See the source and README for setup instructions."],
			caption: ["Webpack 技术标识", "Webpack technology mark"]
		},
		jsplumb: {
			summary: ["基于 jsPlumb 的流程图编辑器探索，展示另一种节点与连线的编排实现。", "A flowchart editor experiment using jsPlumb, demonstrating another approach to composing nodes and connections."],
			features: ["jsPlumb · 节点编排 · 流程连线", "jsPlumb · Node composition · Flow connections"],
			note: ["作为流程编辑系列的补充项目保留，详细实现与运行方式见源码。", "Retained as a companion project in the flow-editing series. See the repository for implementation and setup."],
			caption: ["JsPlumb 项目标识", "JsPlumb project icon"]
		}
	}, jo = {
		"zh-CN": {},
		en: {}
	};
	for (let [e, t] of Object.entries(Ao)) for (let [n, r] of Object.entries(t)) jo["zh-CN"][`${e}.${n}`] = r[0], jo.en[`${e}.${n}`] = r[1];
	Object.assign(jo["zh-CN"], {
		"detail.features": "核心能力",
		"detail.demo": "打开在线体验",
		"detail.source": "查看源码",
		"detail.archived": "更多探索"
	}), Object.assign(jo.en, {
		"detail.features": "Core capabilities",
		"detail.demo": "Try the live demo",
		"detail.source": "View source",
		"detail.archived": "More explorations"
	}), Mo = {
		labware: "labware-creator-agent/",
		easyui: "EasyUI/",
		flutterflow: "Flutter-EasyFlow/"
	};
})), Po, Z, Fo, Io, Lo, Ro, zo, Bo, Vo, Ho, Uo, Wo = t((() => {
	Oo(), No(), Po = {
		"zh-CN": {
			desktop: "桌面",
			about: "关于我",
			projects: "开源作品",
			craft: "构建方法",
			ai: "AI 工作室",
			contact: "联系我",
			github: "GitHub",
			greeting: "你好，我是 Jason。",
			role: "高级前端工程师 · 深圳",
			headline: "把复杂系统，\n做成好用的产品。",
			subtitle: "可视化编辑器、跨平台应用与 AI 工作流。\n这里是我的数字工作台，欢迎随意探索。",
			explore: "打开我的作品",
			hint: "从下方 Dock，打开一个新想法。",
			file: "认识 Jason",
			folder: "开源项目",
			note: "联系我",
			close: "关闭窗口",
			minimize: "最小化窗口",
			maximize: "切换窗口大小",
			navigation: "应用程序",
			external: "在新标签页打开 GitHub",
			windowhint: "拖动标题栏移动 · 双击放大",
			home: "显示桌面",
			made: "一个关于探索与构建的个人空间"
		},
		en: {
			desktop: "Desktop",
			about: "About me",
			projects: "Open source",
			craft: "How I build",
			ai: "AI Studio",
			contact: "Contact",
			github: "GitHub",
			greeting: "Hello, I’m Jason.",
			role: "Senior Frontend Engineer · Shenzhen",
			headline: "Complex systems.\nThoughtful products.",
			subtitle: "Visual editors, cross-platform apps & AI workflows.\nWelcome to my digital workbench. Make yourself at home.",
			explore: "Explore my work",
			hint: "A new idea is just a Dock icon away.",
			file: "Meet Jason",
			folder: "Open source",
			note: "Get in touch",
			close: "Close window",
			minimize: "Minimize window",
			maximize: "Toggle window size",
			navigation: "Applications",
			external: "Open GitHub in a new tab",
			windowhint: "Drag to move · Double-click to expand",
			home: "Show desktop",
			made: "A personal space for exploring & building"
		}
	}, Object.assign(Po["zh-CN"], {
		mxgraph: "mxGraph 流程编辑器",
		d3: "D3 流程渲染",
		speech: "离线语音识别",
		monaco: "Monaco 代码编辑器",
		jsplumb: "JsPlumb 流程编辑器",
		microfrontends: "微前端与服务发现",
		devskills: "dev-skills",
		yourdream: "YourDream Studio",
		dockScroll: "左右滑动 Dock，探索全部作品",
		directory: "选择一个作品，在独立窗口中打开。"
	}), Object.assign(Po.en, {
		mxgraph: "mxGraph Flow Editor",
		d3: "D3 Flow Renderer",
		speech: "Speech Recognition",
		monaco: "Monaco Code Editor",
		jsplumb: "JsPlumb Flow Editor",
		microfrontends: "Microfrontends & Discovery",
		devskills: "dev-skills",
		yourdream: "YourDream Studio",
		dockScroll: "Swipe the Dock to explore every project",
		directory: "Choose a project to open in its own window."
	}), Object.assign(Po["zh-CN"], jo["zh-CN"], {
		labware: "Labware Creator",
		easyui: "EasyUI",
		flutterflow: "Flutter EasyFlow",
		projects: "全部项目"
	}), Object.assign(Po.en, jo.en, {
		labware: "Labware Creator",
		easyui: "EasyUI",
		flutterflow: "Flutter EasyFlow",
		projects: "All projects"
	}), Z = (e) => Po[X.locale === "en" ? "en" : "zh-CN"][e] || e, Fo = (e) => `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${e}</svg>`, Io = {
		about: Fo("<path d=\"M5 10a6 6 0 0 1 6-6h13v40H11a6 6 0 0 1-6-6Z\" fill=\"#8cdcff\"/><path d=\"M24 4h13a6 6 0 0 1 6 6v28a6 6 0 0 1-6 6H24Z\" fill=\"#f2f4ef\"/><path d=\"M24 4c-5 8-8 17-5 22h8v12\" stroke=\"#2475b0\" stroke-width=\"2\"/><path d=\"M12 16v3m23-3v3m-23 10c6 7 17 7 23 0\" stroke=\"#1d4674\" stroke-width=\"2.3\" stroke-linecap=\"round\"/>"),
		projects: Fo("<path d=\"M3 13a4 4 0 0 1 4-4h12l5 5h17a4 4 0 0 1 4 4v22H3Z\" fill=\"#8be0ff\"/><path d=\"M3 20a4 4 0 0 1 4-4h34a4 4 0 0 1 4 4v17a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z\" fill=\"#3aaff1\"/><path d=\"m19 24-5 5 5 5m10-10 5 5-5 5\" stroke=\"#e7f8ff\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"),
		craft: Fo("<rect x=\"5\" y=\"4\" width=\"38\" height=\"40\" rx=\"8\" fill=\"#fff8dd\"/><path d=\"M5 12a8 8 0 0 1 8-8h22a8 8 0 0 1 8 8v3H5Z\" fill=\"#ffd657\"/><path d=\"M13 23h23m-23 7h23m-23 7h15\" stroke=\"#a7a391\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"m29 33 10-10 3 3-10 10-5 2Z\" fill=\"#e79c30\"/>"),
		ai: Fo("<rect x=\"3\" y=\"3\" width=\"42\" height=\"42\" rx=\"12\" fill=\"#9b67db\"/><path d=\"m24 9 4.3 10.7L39 24l-10.7 4.3L24 39l-4.3-10.7L9 24l10.7-4.3Z\" fill=\"#fff5fa\"/><path d=\"m36 7 1.4 3.6L41 12l-3.6 1.4L36 17l-1.4-3.6L31 12l3.6-1.4Z\" fill=\"#f5d387\"/>"),
		contact: Fo("<rect x=\"3\" y=\"6\" width=\"42\" height=\"36\" rx=\"9\" fill=\"#398ef5\"/><path d=\"M8 13h32v24H8Z\" fill=\"#fafcff\"/><path d=\"m8 13 16 13 16-13M8 37l12-14m20 14L28 23\" stroke=\"#85b7ee\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>"),
		github: Fo("<rect x=\"3\" y=\"3\" width=\"42\" height=\"42\" rx=\"12\" fill=\"#292d38\"/><path d=\"M16 35c-1-5 0-7 3-8-7-1-9-8-6-12l-1-6 7 3a19 19 0 0 1 10 0l7-3-1 6c3 4 1 11-6 12 3 1 4 4 3 10H16\" fill=\"#faf8f4\"/><path d=\"M17 32c-7 2-6-5-10-4\" stroke=\"#faf8f4\" stroke-width=\"2\" stroke-linecap=\"round\"/>")
	}, Lo = [
		{
			id: "yourdream",
			hash: "yourdream",
			key: "yourdream",
			repo: "YourDream Studio",
			content: document.getElementById("yourdream")
		},
		{
			id: "labware",
			hash: "labware",
			key: "labware",
			repo: "labware-creator-agent"
		},
		{
			id: "easyui",
			hash: "easyui",
			key: "easyui",
			repo: "EasyUI"
		},
		{
			id: "mxgraph",
			hash: "project-0",
			key: "mxgraph",
			repo: "Mxgraph-EasyFlowEditor",
			content: document.getElementById("project-0").closest("article")
		},
		{
			id: "speech",
			hash: "project-2",
			key: "speech",
			repo: "Flutter-EasySpeechRecognition",
			content: document.getElementById("project-2").closest("article")
		},
		{
			id: "devskills",
			hash: "dev-skills",
			key: "devskills",
			repo: "dev-skills",
			content: document.getElementById("dev-skills")
		},
		{
			id: "flutterflow",
			hash: "flutterflow",
			key: "flutterflow",
			repo: "Flutter-EasyFlow",
			dock: !1
		},
		{
			id: "d3",
			hash: "project-1",
			key: "d3",
			repo: "D3-EasyFlowRender",
			dock: !1,
			content: document.getElementById("project-1").closest("article")
		},
		{
			id: "microfrontends",
			hash: "microfrontends",
			key: "microfrontends",
			repo: "Webpack5Mfp-Node-Nacos",
			dock: !1
		},
		{
			id: "monaco",
			hash: "project-3",
			key: "monaco",
			repo: "Monaco-EasyCodeEditor",
			dock: !1,
			archived: !0,
			content: document.getElementById("project-3").closest("article")
		},
		{
			id: "jsplumb",
			hash: "jsplumb",
			key: "jsplumb",
			repo: "JsPlumb-EasyFlowEditor",
			dock: !1,
			archived: !0
		}
	], Ro = {
		mxgraph: "mxgraph.png",
		d3: "d3.svg",
		speech: "speech.jpg",
		monaco: "monaco.jpg",
		labware: "labware.png",
		easyui: "easyui.png",
		flutterflow: "flutterflow.png",
		jsplumb: "jsplumb.ico",
		microfrontends: "webpack.png",
		devskills: "devskills.png",
		yourdream: "yourdream.png"
	}, Lo.forEach((e) => {
		Io[e.id] = `<span class="mac-project-icon mac-project-icon--${e.id}" data-project-icon="${e.id}"><img src="./assets/project-icons/${Ro[e.id]}" alt="" draggable="false" decoding="async" /></span>`, e.content ||= ko(e, Z, Ro[e.id]), e.content.classList.add("mac-project-content");
	}), zo = document.getElementById("opensource"), Bo = document.createElement("div"), Bo.className = "mac-project-directory", Bo.innerHTML = `<p data-desktop-text="directory">${Z("directory")}</p><div class="mac-project-launchers">${Lo.filter((e) => !e.archived).map((e) => `<button data-app-open="${e.id}" class="mac-project-launcher"><span class="mac-directory-icon">${Io[e.id]}</span><span><strong data-desktop-text="${e.key}">${Z(e.key)}</strong><small>${e.repo}</small></span><span aria-hidden="true">↗</span></button>`).join("")}</div>`, zo.querySelector(".project-ledger").after(Bo), zo.querySelector(".more-projects").remove(), Vo = [
		{
			id: "about",
			hash: "about",
			key: "about"
		},
		{
			id: "projects",
			hash: "opensource",
			key: "projects",
			dock: !1
		},
		...Lo,
		{
			id: "craft",
			hash: "craft",
			key: "craft",
			dock: !1
		},
		{
			id: "contact",
			hash: "contact",
			key: "contact"
		}
	], Ho = [...Vo.filter((e) => e.dock !== !1), {
		id: "github",
		key: "github"
	}], Uo = Object.fromEntries(Vo.map((e) => [e.id, {
		...e,
		should_open_window: !0,
		expandable: !0,
		width: 1050,
		height: 720
	}]));
})), Go, Ko, qo = t((() => {
	Go = function() {}, Ko = function() {};
})), Jo, Yo = t((() => {
	Jo = (e, t, n) => Math.min(Math.max(n, e), t);
})), Xo, Zo = t((() => {
	Xo = (e, t, n) => {
		let r = t - e;
		return r === 0 ? 1 : (n - e) / r;
	};
})), Qo, $o = t((() => {
	Qo = (e, t, n) => -n * e + n * t + e;
}));
//#endregion
//#region node_modules/style-value-types/dist/es/utils.mjs
function es(e) {
	return typeof e == "string";
}
var ts, ns, rs, is, as, os = t((() => {
	ts = (e, t) => (n) => Math.max(Math.min(n, t), e), ns = (e) => e % 1 ? Number(e.toFixed(5)) : e, rs = /(-)?([\d]*\.?[\d])+/g, is = /(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi, as = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;
})), ss, cs, ls = t((() => {
	os(), ss = {
		test: (e) => typeof e == "number",
		parse: parseFloat,
		transform: (e) => e
	}, cs = Object.assign(Object.assign({}, ss), { transform: ts(0, 1) }), Object.assign(Object.assign({}, ss), { default: 1 });
})), us, ds, fs = t((() => {
	os(), us = (e) => ({
		test: (t) => es(t) && t.endsWith(e) && t.split(" ").length === 1,
		parse: parseFloat,
		transform: (t) => `${t}${e}`
	}), us("deg"), ds = us("%"), us("px"), us("vh"), us("vw"), Object.assign(Object.assign({}, ds), {
		parse: (e) => ds.parse(e) / 100,
		transform: (e) => ds.transform(e * 100)
	});
})), ps, ms, hs = t((() => {
	os(), ps = (e, t) => (n) => !!(es(n) && as.test(n) && n.startsWith(e) || t && Object.prototype.hasOwnProperty.call(n, t)), ms = (e, t, n) => (r) => {
		if (!es(r)) return r;
		let [i, a, o, s] = r.match(rs);
		return {
			[e]: parseFloat(i),
			[t]: parseFloat(a),
			[n]: parseFloat(o),
			alpha: s === void 0 ? 1 : parseFloat(s)
		};
	};
})), gs, _s = t((() => {
	ls(), fs(), os(), hs(), gs = {
		test: ps("hsl", "hue"),
		parse: ms("hue", "saturation", "lightness"),
		transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + ds.transform(ns(t)) + ", " + ds.transform(ns(n)) + ", " + ns(cs.transform(r)) + ")"
	};
})), vs, ys, bs, xs = t((() => {
	ls(), os(), hs(), vs = ts(0, 255), ys = Object.assign(Object.assign({}, ss), { transform: (e) => Math.round(vs(e)) }), bs = {
		test: ps("rgb", "red"),
		parse: ms("red", "green", "blue"),
		transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + ys.transform(e) + ", " + ys.transform(t) + ", " + ys.transform(n) + ", " + ns(cs.transform(r)) + ")"
	};
}));
//#endregion
//#region node_modules/style-value-types/dist/es/color/hex.mjs
function Ss(e) {
	let t = "", n = "", r = "", i = "";
	return e.length > 5 ? (t = e.substr(1, 2), n = e.substr(3, 2), r = e.substr(5, 2), i = e.substr(7, 2)) : (t = e.substr(1, 1), n = e.substr(2, 1), r = e.substr(3, 1), i = e.substr(4, 1), t += t, n += n, r += r, i += i), {
		red: parseInt(t, 16),
		green: parseInt(n, 16),
		blue: parseInt(r, 16),
		alpha: i ? parseInt(i, 16) / 255 : 1
	};
}
var Cs, ws = t((() => {
	xs(), hs(), Cs = {
		test: ps("#"),
		parse: Ss,
		transform: bs.transform
	};
})), Ts, Es = t((() => {
	os(), ws(), _s(), xs(), Ts = {
		test: (e) => bs.test(e) || Cs.test(e) || gs.test(e),
		parse: (e) => bs.test(e) ? bs.parse(e) : gs.test(e) ? gs.parse(e) : Cs.parse(e),
		transform: (e) => es(e) ? e : e.hasOwnProperty("red") ? bs.transform(e) : gs.transform(e)
	};
}));
//#endregion
//#region node_modules/style-value-types/dist/es/complex/index.mjs
function Ds(e) {
	return isNaN(e) && es(e) && (e.match(rs)?.length ?? 0) + (e.match(is)?.length ?? 0) > 0;
}
function Os(e) {
	typeof e == "number" && (e = `${e}`);
	let t = [], n = 0, r = e.match(is);
	r && (n = r.length, e = e.replace(is, Ms), t.push(...r.map(Ts.parse)));
	let i = e.match(rs);
	return i && (e = e.replace(rs, Ns), t.push(...i.map(ss.parse))), {
		values: t,
		numColors: n,
		tokenised: e
	};
}
function ks(e) {
	return Os(e).values;
}
function As(e) {
	let { values: t, numColors: n, tokenised: r } = Os(e), i = t.length;
	return (e) => {
		let t = r;
		for (let r = 0; r < i; r++) t = t.replace(r < n ? Ms : Ns, r < n ? Ts.transform(e[r]) : ns(e[r]));
		return t;
	};
}
function js(e) {
	let t = ks(e);
	return As(e)(t.map(Ps));
}
var Ms, Ns, Ps, Fs, Is = t((() => {
	Es(), ls(), os(), Ms = "${c}", Ns = "${n}", Ps = (e) => typeof e == "number" ? 0 : e, Fs = {
		test: Ds,
		parse: ks,
		createTransformer: As,
		getAnimatableNone: js
	};
})), Ls = t((() => {
	ls(), fs(), _s(), xs(), ws(), Es(), Is(), os();
}));
//#endregion
//#region node_modules/popmotion/dist/es/utils/hsla-to-rgba.mjs
function Rs(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function zs({ hue: e, saturation: t, lightness: n, alpha: r }) {
	e /= 360, t /= 100, n /= 100;
	let i = 0, a = 0, o = 0;
	if (!t) i = a = o = n;
	else {
		let r = n < .5 ? n * (1 + t) : n + t - n * t, s = 2 * n - r;
		i = Rs(s, r, e + 1 / 3), a = Rs(s, r, e), o = Rs(s, r, e - 1 / 3);
	}
	return {
		red: Math.round(i * 255),
		green: Math.round(a * 255),
		blue: Math.round(o * 255),
		alpha: r
	};
}
var Bs = t((() => {})), Vs, Hs, Us, Ws, Gs, Ks = t((() => {
	$o(), Ls(), qo(), Bs(), Vs = (e, t, n) => {
		let r = e * e, i = t * t;
		return Math.sqrt(Math.max(0, n * (i - r) + r));
	}, Hs = [
		Cs,
		bs,
		gs
	], Us = (e) => Hs.find((t) => t.test(e)), Ws = (e) => `'${e}' is not an animatable color. Use the equivalent color code instead.`, Gs = (e, t) => {
		let n = Us(e), r = Us(t);
		Ko(!!n, Ws(e)), Ko(!!r, Ws(t));
		let i = n.parse(e), a = r.parse(t);
		n === gs && (i = zs(i), n = bs), r === gs && (a = zs(a), r = bs);
		let o = Object.assign({}, i);
		return (e) => {
			for (let t in o) t !== "alpha" && (o[t] = Vs(i[t], a[t], e));
			return o.alpha = Qo(i.alpha, a.alpha, e), n.transform(o);
		};
	};
})), qs, Js = t((() => {
	qs = (e) => typeof e == "number";
})), Ys, Xs, Zs = t((() => {
	Ys = (e, t) => (n) => t(e(n)), Xs = (...e) => e.reduce(Ys);
}));
//#endregion
//#region node_modules/popmotion/dist/es/utils/mix-complex.mjs
function Qs(e, t) {
	return qs(e) ? (n) => Qo(e, t, n) : Ts.test(e) ? Gs(e, t) : nc(e, t);
}
function $s(e) {
	let t = Fs.parse(e), n = t.length, r = 0, i = 0, a = 0;
	for (let e = 0; e < n; e++) r || typeof t[e] == "number" ? r++ : t[e].hue === void 0 ? i++ : a++;
	return {
		parsed: t,
		numNumbers: r,
		numRGB: i,
		numHSL: a
	};
}
var ec, tc, nc, rc = t((() => {
	Ls(), $o(), Ks(), Js(), Zs(), qo(), ec = (e, t) => {
		let n = [...e], r = n.length, i = e.map((e, n) => Qs(e, t[n]));
		return (e) => {
			for (let t = 0; t < r; t++) n[t] = i[t](e);
			return n;
		};
	}, tc = (e, t) => {
		let n = Object.assign(Object.assign({}, e), t), r = {};
		for (let i in n) e[i] !== void 0 && t[i] !== void 0 && (r[i] = Qs(e[i], t[i]));
		return (e) => {
			for (let t in r) n[t] = r[t](e);
			return n;
		};
	}, nc = (e, t) => {
		let n = Fs.createTransformer(t), r = $s(e), i = $s(t);
		return r.numHSL === i.numHSL && r.numRGB === i.numRGB && r.numNumbers >= i.numNumbers ? Xs(ec(r.parsed, i.parsed), n) : (Go(!0, `Complex values '${e}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`), (n) => `${n > 0 ? t : e}`);
	};
}));
//#endregion
//#region node_modules/popmotion/dist/es/utils/interpolate.mjs
function ic(e) {
	if (typeof e == "number") return lc;
	if (typeof e == "string") return Ts.test(e) ? Gs : nc;
	if (Array.isArray(e)) return ec;
	if (typeof e == "object") return tc;
}
function ac(e, t, n) {
	let r = [], i = n || ic(e[0]), a = e.length - 1;
	for (let n = 0; n < a; n++) {
		let a = i(e[n], e[n + 1]);
		t && (a = Xs(Array.isArray(t) ? t[n] : t, a)), r.push(a);
	}
	return r;
}
function oc([e, t], [n]) {
	return (r) => n(Xo(e, t, r));
}
function sc(e, t) {
	let n = e.length, r = n - 1;
	return (i) => {
		let a = 0, o = !1;
		if (i <= e[0] ? o = !0 : i >= e[r] && (a = r - 1, o = !0), !o) {
			let t = 1;
			for (; t < n && !(e[t] > i || t === r); t++);
			a = t - 1;
		}
		let s = Xo(e[a], e[a + 1], i);
		return t[a](s);
	};
}
function cc(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
	let a = e.length;
	Ko(a === t.length, "Both input and output ranges must be the same length"), Ko(!r || !Array.isArray(r) || r.length === a - 1, "Array of easing functions must be of length `input.length - 1`, as it applies to the transitions **between** the defined values."), e[0] > e[a - 1] && (e = [].concat(e), t = [].concat(t), e.reverse(), t.reverse());
	let o = ac(t, r, i), s = a === 2 ? oc(e, o) : sc(e, o);
	return n ? (t) => s(Jo(e[0], e[a - 1], t)) : s;
}
var lc, uc = t((() => {
	Zo(), $o(), Ks(), rc(), Ls(), Yo(), Zs(), qo(), lc = (e, t) => (n) => Qo(e, t, n);
})), dc = t((() => {
	qo(), Yo(), uc(), Js(), Ks(), rc(), $o(), Zs(), Zo();
}));
//#endregion
//#region src/components/Dock/magnification.ts
function fc(e, t) {
	let n = 0;
	for (let r = 0; r <= Math.max(0, e - 1) * t; r += Q / 8) {
		let i = 0;
		for (let n = 0; n < e; n++) i += mc(r - n * t) - Q;
		n = Math.max(n, i);
	}
	return n * 1.15;
}
var Q, pc, mc, hc = t((() => {
	dc(), Q = 57.6, pc = Q * 6, mc = cc([
		-345.6,
		-345.6 / 1.25,
		-345.6 / 2,
		0,
		pc / 2,
		pc / 1.25,
		pc
	], [
		Q,
		Q * 1.1,
		Q * 1.414,
		Q * 2,
		Q * 1.414,
		Q * 1.1,
		Q
	]);
}));
//#endregion
//#region node_modules/svelte/src/easing/index.js
function gc(e) {
	return e;
}
function _c(e) {
	return -.5 * (Math.cos(Math.PI * e) - 1);
}
var vc = t((() => {})), yc = t((() => {
	Y(), I(), at(), W();
})), bc = t((() => {
	I(), at(), W();
})), xc = t((() => {
	I(), at(), W();
})), Sc = t((() => {
	I(), at(), W(), Cc();
})), Cc = t((() => {
	I(), at(), W(), Sc();
})), wc = t((() => {
	Di();
})), Tc = t((() => {
	Bt();
})), Ec = t((() => {
	wc(), Tc();
})), Dc = t((() => {
	yc(), bc(), xc(), Cc(), Sc(), Ec(), Bt();
}));
//#endregion
//#region node_modules/svelte/src/motion/utils.js
function Oc(e) {
	return Object.prototype.toString.call(e) === "[object Date]";
}
var kc = t((() => {}));
//#endregion
//#region node_modules/svelte/src/motion/spring.js
function Ac(e, t, n, r) {
	if (typeof n == "number" || Oc(n)) {
		let i = r - n, a = (n - t) / (e.dt || 1 / 60), o = (a + (e.opts.stiffness * i - e.opts.damping * a) * e.inv_mass) * e.dt;
		return Math.abs(o) < e.opts.precision && Math.abs(i) < e.opts.precision ? r : (e.settled = !1, Oc(n) ? new Date(n.getTime() + o) : n + o);
	} else if (Array.isArray(n)) return n.map((i, a) => Ac(e, t[a], n[a], r[a]));
	else if (typeof n == "object") {
		let i = {};
		for (let a in n) i[a] = Ac(e, t[a], n[a], r[a]);
		return i;
	} else throw Error(`Cannot spring ${typeof n} values`);
}
function jc(e, t = {}) {
	let n = Dt(e), { stiffness: r = .15, damping: i = .8, precision: a = .01 } = t, o, s, c, l = e, u = e, d = 1, f = 0, p = !1;
	function m(t, r = {}) {
		u = t;
		let i = c = {};
		return e == null || r.hard || h.stiffness >= 1 && h.damping >= 1 ? (p = !0, o = xa.now(), l = t, n.set(e = u), Promise.resolve()) : (r.soft && (f = 1 / ((r.soft === !0 ? .5 : +r.soft) * 60), d = 0), s ||= (o = xa.now(), p = !1, wa((t) => {
			if (p) return p = !1, s = null, !1;
			d = Math.min(d + f, 1);
			let r = Math.min(t - o, 1e3 / 30), i = {
				inv_mass: d,
				opts: h,
				settled: !0,
				dt: r * 60 / 1e3
			}, a = Ac(i, l, e, u);
			return o = t, l = e, n.set(e = a), i.settled && (s = null), !i.settled;
		})), new Promise((e) => {
			s.promise.then(() => {
				i === c && e();
			});
		}));
	}
	let h = {
		set: m,
		update: (t, n) => m(t(u, e), n),
		subscribe: n.subscribe,
		stiffness: r,
		damping: i,
		precision: a
	};
	return h;
}
var Mc = t((() => {
	At(), Ta(), Sa(), kc(), I(), B(), at(), W(), b();
}));
//#endregion
//#region node_modules/svelte/src/motion/tweened.js
function Nc(e, t) {
	if (e === t || e !== e) return () => e;
	let n = typeof e;
	if (n !== typeof t || Array.isArray(e) !== Array.isArray(t)) throw Error("Cannot interpolate values of different type");
	if (Array.isArray(e)) {
		let n = t.map((t, n) => Nc(e[n], t));
		return (e) => n.map((t) => t(e));
	}
	if (n === "object") {
		if (!e || !t) throw Error("Object cannot be null");
		if (Oc(e) && Oc(t)) {
			let n = e.getTime(), r = t.getTime() - n;
			return (e) => new Date(n + e * r);
		}
		let n = Object.keys(t), r = {};
		return n.forEach((n) => {
			r[n] = Nc(e[n], t[n]);
		}), (e) => {
			let t = {};
			return n.forEach((n) => {
				t[n] = r[n](e);
			}), t;
		};
	}
	if (n === "number") {
		let n = t - e;
		return (t) => e + t * n;
	}
	return () => t;
}
function Pc(e, t = {}) {
	let n = Dt(e), r, i = e;
	function a(a, o) {
		if (i = a, e == null) return n.set(e = a), Promise.resolve();
		let s = r, c = !1, { delay: l = 0, duration: u = 400, easing: d = gc, interpolate: f = Nc } = {
			...t,
			...o
		};
		if (u === 0) return s &&= (s.abort(), null), n.set(e = i), Promise.resolve();
		let p = xa.now() + l, m;
		return r = wa((t) => {
			if (t < p) return !0;
			c ||= (m = f(e, a), typeof u == "function" && (u = u(e, a)), !0), s &&= (s.abort(), null);
			let r = t - p;
			return r > u ? (n.set(e = a), !1) : (n.set(e = m(d(r / u))), !0);
		}), r.promise;
	}
	return {
		set: a,
		update: (t, n) => a(t(i, e), n),
		subscribe: n.subscribe
	};
}
var Fc = t((() => {
	At(), Sa(), Ta(), vc(), kc(), I(), at(), Y();
})), Ic = t((() => {
	Dc(), Mc(), Fc();
})), $, Lc = t((() => {
	Y(), Wo(), $ = Bn({
		open: Object.fromEntries(Vo.map((e) => [e.id, !1])),
		exiting: {},
		minimized: {},
		active: "",
		active_z_index: 0,
		z_indices: Object.fromEntries(Vo.map((e) => [e.id, 0])),
		is_being_dragged: !1,
		fullscreen: {}
	});
})), Rc = t((() => {}));
//#endregion
//#region src/portfolio/window-motion.ts
function zc() {
	return qc.size || (Jc = 0), String(1e6 + ++Jc);
}
function Bc(e) {
	delete e.dataset.windowMotion, e.style.removeProperty("--window-motion-z-index");
}
function Vc(e) {
	let t = qc.get(e);
	if (!t) return;
	let n = getComputedStyle(t.visual), r = {
		transform: n.transform,
		opacity: n.opacity,
		genie: t.progress?.(),
		geometry: t.geometry
	};
	return qc.delete(e), t.animations.forEach((e) => e.cancel()), t.cleanup(), Bc(t.window), r;
}
function Hc(e) {
	for (let [t, n] of qc) (!e || e === t) && n.animations.forEach((e) => e.finish());
}
function Uc(e, t, n) {
	let r = document.querySelector(`[data-dock="${e}"]`), i = r || n;
	if (!i?.isConnected || !i.getClientRects().length) return {
		x: t.left + t.width / 2,
		y: t.top + t.height * .8,
		width: 58,
		height: 38
	};
	let a = i.getBoundingClientRect(), o = (r?.closest(".mac-dock-viewport"))?.getBoundingClientRect(), s = Math.min(a.width, 58), c = Math.min(a.height, 58), l = r?.querySelector(".mac-dock-icon"), u = r?.querySelector(".mac-dock-dot"), d = l ? a.bottom - (u?.offsetHeight || 0) - (u && parseFloat(getComputedStyle(u).marginTop) || 0) - l.offsetHeight / 2 : a.top + a.height / 2;
	return {
		x: Yc(a.left + a.width / 2, Math.max(8, o?.left ?? 8) + s / 2, Math.min(innerWidth - 8, o?.right ?? innerWidth - 8) - s / 2),
		y: Yc(d, 36 + c / 2, innerHeight - c / 2 - 8),
		width: s,
		height: c
	};
}
function Wc(e, t) {
	let n = e.cloneNode(!0), r = [e, ...e.querySelectorAll("*")], i = [n, ...n.querySelectorAll("*")], a = [];
	r.forEach((e, t) => {
		let n = i[t];
		e instanceof SVGElement && e.id && n.setAttribute("data-genie-svg-id", e.id), n.removeAttribute("id");
		for (let e of [...n.attributes]) (e.name.startsWith("on") || /^(aria-labelledby|aria-describedby|aria-controls|aria-owns|for|autoplay|name)$/.test(e.name)) && n.removeAttribute(e.name);
		if ((e.scrollTop || e.scrollLeft) && a.push({
			index: t,
			top: e.scrollTop,
			left: e.scrollLeft
		}), e instanceof HTMLVideoElement || e instanceof HTMLCanvasElement) {
			let r = document.createElement("img");
			r.className = e.className, r.style.cssText = e.style.cssText, r.alt = "", r.draggable = !1;
			try {
				let t = document.createElement("canvas");
				if (e.style.opacity === "0" || e.style.display === "none") throw Error("Hidden presentation");
				let n = e instanceof HTMLVideoElement ? e.videoWidth : e.width, i = e instanceof HTMLVideoElement ? e.videoHeight : e.height, a = Math.min(1, 1280 / n, Math.max(1, e.clientWidth) * Math.min(devicePixelRatio, 1.25) / n);
				if (t.width = Math.round(n * a), t.height = Math.round(i * a), !t.width || !t.height) throw Error("No decoded frame");
				t.getContext("2d").drawImage(e, 0, 0, t.width, t.height), r.src = t.toDataURL("image/png");
			} catch {
				e instanceof HTMLVideoElement && e.poster && (r.src = e.poster);
			}
			n.replaceWith(r), i[t] = r;
		} else /^(SCRIPT|IFRAME|AUDIO|SOURCE|TRACK)$/.test(n.tagName) && n.remove();
	}), Object.assign(n.style, {
		width: `${t.width}px`,
		height: `${t.height}px`,
		position: "absolute",
		inset: "0",
		transform: "none",
		opacity: "1",
		visibility: "visible",
		boxShadow: "none",
		backgroundColor: "#f4f6fa",
		pointerEvents: "none"
	});
	let o = getComputedStyle(e);
	n.style.borderRadius = o.borderRadius;
	for (let e of [
		"--paper",
		"--paper-deep",
		"--ink",
		"--ink-2",
		"--muted",
		"--line",
		"--serif",
		"--sans"
	]) n.style.setProperty(e, o.getPropertyValue(e));
	return {
		copy: n,
		scrolls: a.map((e) => ({
			...e,
			node: i[e.index]
		}))
	};
}
function Gc(e, t, n, r, i, a, o) {
	let s = a?.geometry?.rect || r.getBoundingClientRect(), c = a?.geometry?.target || {
		...Uc(e, s, o),
		width: 2,
		height: 2
	}, l = {
		rect: s,
		target: c
	}, u = document.createElement("div");
	u.className = "mac-genie-overlay", u.dataset.genieFor = e, u.setAttribute("aria-hidden", "true"), u.inert = !0, Object.assign(u.style, {
		position: "fixed",
		inset: "0",
		pointerEvents: "none",
		zIndex: i,
		overflow: "hidden"
	});
	let { copy: d, scrolls: f } = Wc(n, s), p = (e) => s.height * (e / 16) ** 1.3, m = a?.genie ?? +(t === "restoring"), h = t === "restoring" ? 0 : 1, g = Math.max(180, 520 * Math.abs(h - m)), _ = (e) => t === "minimizing" ? e : Xc(e), v = [], y = [d, ...d.querySelectorAll("*")], b = f.map((e) => ({
		...e,
		index: y.indexOf(e.node)
	})), x = document.createDocumentFragment(), S = c.y < s.top + s.height / 2, C = (e, t) => {
		let n = Zc(t / .32), r = Zc((t - .27) / .73), i = c.width + s.width * .04 * (1 - Zc((t - .78) / .22)), a = Yc(S ? 1 - e : e), o = 1 - Zc(a), l = 1 - r, u = i + (i + (s.width - i) * Zc(l) - i) * o, d = s.left + s.width / 2, f = d + (c.x - d) * r, p = c.x + (f - c.x) * o, m = S ? -1 : 1, h = S ? s.bottom : s.top, g = c.y - m * i / 2, _ = h + (g - h) * r, v = _ + a * (g - _ + m * i), y = s.width + (u - s.width) * n, b = d + (p - d) * n, x = s.top + e * s.height + (v - s.top - e * s.height) * n;
		return {
			left: b - y / 2,
			width: y,
			y: x
		};
	};
	for (let t = 0; t < 16; t++) {
		let n = document.createElement("div");
		n.className = "mac-genie-slice", n.dataset.slice = String(t);
		let r = p(t), i = p(t + 1) - r + 2;
		Object.assign(n.style, {
			position: "absolute",
			left: "0",
			top: "0",
			width: `${s.width}px`,
			height: `${i}px`,
			overflow: "hidden",
			transformOrigin: "0 0",
			willChange: "transform",
			pointerEvents: "none"
		});
		let a = d.cloneNode(!0);
		a.style.top = `${-r}px`;
		let o = /* @__PURE__ */ new Map();
		a.querySelectorAll("[data-genie-svg-id]").forEach((n) => {
			let r = n.getAttribute("data-genie-svg-id"), i = `genie-${e}-${t}-${r}`;
			o.set(r, i), n.id = i, n.removeAttribute("data-genie-svg-id");
		}), o.size && a.querySelectorAll("*").forEach((e) => {
			for (let t of [...e.attributes]) {
				let n = t.value.replace(/url\(["']?#([^)'"]+)["']?\)/g, (e, t) => o.has(t) ? `url(#${o.get(t)})` : e);
				(t.name === "href" || t.name === "xlink:href") && n.startsWith("#") && o.has(n.slice(1)) && (n = `#${o.get(n.slice(1))}`), n !== t.value && e.setAttribute(t.name, n);
			}
		}), n.append(a), x.append(n);
		let c = [];
		for (let e = 0; e <= 40; e++) {
			let t = m + (h - m) * _(e / 40), n = C(r / s.height, t), a = C((r + i) / s.height, t), o = n.width / a.width, l = n.width / s.width, u = (a.left * o - n.left) / i, d = (a.y * o - n.y) / i, f = (o - 1) / i;
			c.push({
				offset: e / 40,
				transform: `matrix3d(${l},0,0,0,${u},${d},0,${f},0,0,1,0,${n.left},${n.y},0,1)`,
				opacity: String(1 - Zc((t - .84) / .16))
			});
		}
		let l = n.animate(c, {
			duration: g,
			easing: "linear",
			fill: "both"
		});
		l.pause(), v.push(l);
	}
	document.getElementById("windows-area").append(u), u.append(x), b.length && u.querySelectorAll(".mac-window-visual").forEach((e) => {
		let t = [e, ...e.querySelectorAll("*")];
		for (let e of b) t[e.index] && (t[e.index].scrollTop = e.top, t[e.index].scrollLeft = e.left);
	}), v.forEach((e) => {
		e.currentTime = 0, e.play();
	});
	let w = n.style.opacity, ee = n.style.pointerEvents;
	return n.style.opacity = "0", n.style.pointerEvents = "none", {
		animations: v,
		visual: n,
		window: r,
		geometry: l,
		progress: () => m + (h - m) * _(Yc(Number(v[0].currentTime || 0) / g)),
		cleanup: () => {
			u.remove(), n.style.opacity = w, n.style.pointerEvents = ee;
		}
	};
}
async function Kc(e, t, n, r) {
	let i = document.getElementById(`mac-window-${e}`), a = i?.querySelector(".mac-window-visual");
	if (!i || !a || X.reduced || !a.animate) return;
	let o = zc(), s;
	if (t === "minimizing" || t === "restoring" || t === "opening" && n?.genie !== void 0) s = Gc(e, t === "opening" ? "restoring" : t, a, i, o, n, r);
	else {
		let o = i.getBoundingClientRect(), c = Uc(e, o, r), l = {
			transform: "translate(0px, 0px) scale(1)",
			opacity: "1"
		}, u = t === "closing" ? {
			transform: "scale(.97)",
			opacity: "0"
		} : {
			transform: `translate(${c.x - o.left - o.width / 2}px, ${c.y - o.top - o.height / 2}px) scale(${c.width / o.width},${c.height / o.height})`,
			opacity: ".12"
		};
		s = {
			animations: [a.animate(t === "opening" ? [n || u, l] : [n?.genie === void 0 && n || l, u], {
				duration: t === "closing" ? 140 : 360,
				easing: "cubic-bezier(.22,.75,.2,1)",
				fill: "both"
			})],
			visual: a,
			window: i,
			cleanup: () => {}
		};
	}
	qc.set(e, s), i.style.setProperty("--window-motion-z-index", o), i.dataset.windowMotion = t;
	try {
		await Promise.all(s.animations.map((e) => e.finished));
	} catch {} finally {
		qc.get(e) === s && (qc.delete(e), s.animations.forEach((e) => e.cancel()), s.cleanup(), Bc(i), i.dispatchEvent(new CustomEvent("window-motion-settled")));
	}
}
var qc, Jc, Yc, Xc, Zc, Qc = t((() => {
	Oo(), Rc(), qc = /* @__PURE__ */ new Map(), Jc = 0, Yc = (e, t = 0, n = 1) => Math.min(n, Math.max(t, e)), Xc = (e) => e - Math.sin(2 * Math.PI * e) / (2 * Math.PI), Zc = (e) => {
		let t = Yc(e);
		return t * t * (3 - 2 * t);
	};
}));
//#endregion
//#region src/portfolio/actions.ts
function $c(e) {
	let t = (ul.get(e) || 0) + 1;
	return ul.set(e, t), {
		version: t,
		frame: Vc(e)
	};
}
function el(e, t) {
	Yr().then(() => {
		t === dl && e()?.focus({ preventScroll: !0 });
	});
}
function tl(e) {
	history.pushState(null, "", `${location.pathname}${location.search}${e ? `#${e}` : ""}`);
}
function nl(e) {
	$.active = e, $.active_z_index > 1e4 && (Object.keys($.z_indices).sort((e, t) => $.z_indices[e] - $.z_indices[t]).forEach((e, t) => $.z_indices[e] = t + 1), $.active_z_index = Vo.length), $.z_indices[e] = ++$.active_z_index;
}
async function rl(e, t = !0) {
	if (!Uo[e]) return;
	let n = !!$.minimized[e], r = !$.open[e] || n || $.exiting[e], { version: i, frame: a } = $c(e), o = document.getElementById(`mac-window-${e}`);
	document.activeElement instanceof HTMLElement && document.activeElement !== document.body && !o?.contains(document.activeElement) && ll.set(e, document.activeElement), $.exiting[e] = !1, $.open[e] = !0, $.minimized[e] = !1, nl(e);
	let s = ++dl;
	t && location.hash !== `#${Uo[e].hash}` && tl(Uo[e].hash), el(() => document.querySelector(`#mac-window-${e} [data-window-action='close']`), s), await Yr(), ul.get(e) === i && (r || a) && await Kc(e, n ? "restoring" : "opening", a, ll.get(e));
}
function il(e) {
	document.querySelectorAll(`#mac-window-${e} video`).forEach((e) => e.pause());
}
async function al(e, t = !1) {
	if (!$.open[e] || $.minimized[e]) return;
	let { version: n, frame: r } = $c(e);
	il(e), $.exiting[e] = !0;
	let i = ++dl, a = Vo.filter((e) => $.open[e.id] && !$.minimized[e.id] && !$.exiting[e.id]).sort((e, t) => $.z_indices[t.id] - $.z_indices[e.id])[0];
	a ? (nl(a.id), tl(a.hash)) : ($.active = "", tl("")), el(() => a ? document.querySelector(`#mac-window-${a.id} [data-window-action='close']`) : ll.get(e), i), await Kc(e, t ? "minimizing" : "closing", r, ll.get(e)), ul.get(e) === n && (t ? $.minimized[e] = !0 : ($.open[e] = !1, $.fullscreen[e] = !1), $.exiting[e] = !1);
}
function ol(e = !0) {
	++dl;
	for (let e of Vo) $c(e.id), il(e.id), $.exiting[e.id] = !1, $.open[e.id] && ($.minimized[e.id] = !0);
	$.active = "", e && tl("");
}
function sl() {
	let e = "";
	try {
		e = decodeURIComponent(location.hash.slice(1));
	} catch {
		return;
	}
	let t = document.getElementById(e), n = Vo.find((n) => n.hash === e || t?.closest(`#mac-window-${n.id}`));
	n ? rl(n.id, !1) : (!e || e === "top") && ol(!1);
}
function cl(e, t) {
	let n = Uo[t], r = n.content || document.getElementById(n.hash);
	return e.append(r), r.querySelectorAll(".is-pending").forEach((e) => e.classList.remove("is-pending")), { destroy() {
		document.getElementById("main-content")?.append(r);
	} };
}
var ll, ul, dl, fl = t((() => {
	To(), Qc(), Lc(), Wo(), ll = /* @__PURE__ */ new Map(), ul = /* @__PURE__ */ new Map(), dl = 0;
})), pl = t((() => {}));
//#endregion
//#region src/components/Dock/DockItem.svelte
function ml(e, t) {
	ct(t, !0);
	let n = () => jt(c, "$appOpenIconBounceTransform", i), r = () => jt(s, "$width_px", i), [i, a] = Mt(), o = /* @__PURE__ */ jn(void 0), s = jc(Q, {
		damping: .47,
		stiffness: .12
	});
	dr(() => {
		let e = t.mouse_x, n = V(o), r = t.magnification;
		if (X.reduced || X.compact || X.scrollable || $.is_being_dragged) {
			Qr(() => s.set(Q, { hard: !0 }));
			return;
		}
		let i = requestAnimationFrame(() => {
			let t = n?.getBoundingClientRect(), i = e !== null && t ? Q + (mc(e - t.left - t.width / 2) - Q) * r : Q;
			s.set(i);
		});
		return () => cancelAnimationFrame(i);
	});
	let c = Pc(0, {
		duration: 400,
		easing: _c
	});
	async function l() {
		if (t.app_id === "github") {
			window.open("https://github.com/Jason-chen-coder", "_blank", "noopener,noreferrer");
			return;
		}
		let e = $.open[t.app_id];
		rl(t.app_id), !e && !X.reduced && (await c.set(-28), c.set(0));
	}
	var u = hl(), d = L(u);
	let f, p;
	var m = L(d, !0);
	D(d);
	var h = R(d, 2);
	let g;
	var _ = L(h);
	let v;
	ma(_, () => Io[t.app_id], !0), D(_), so(_, (e) => F(o, e), () => V(o)), D(h);
	var y = R(h, 2);
	let b;
	D(u), yr((e, i) => {
		J(u, "aria-label", e), J(u, "aria-expanded", t.app_id === "github" ? void 0 : !!$.open[t.app_id] && !$.minimized[t.app_id]), J(u, "aria-controls", t.app_id === "github" ? void 0 : `mac-window-${t.app_id}`), Ba(u, 1, `dock-open-app-button mac-dock-item ${t.app_id ?? ""}`, "s-1lja36i"), J(u, "data-dock", t.app_id), J(u, "data-app-open", t.app_id), f = Ba(d, 1, "tooltip mac-dock-tooltip s-1lja36i", null, f, { "tooltip-enabled": !$.is_being_dragged }), p = Ua(d, "", p, { transform: `translate(0, ${n() ?? ""}px)` }), q(m, i), g = Ua(h, "", g, { transform: `translate(0, ${n() ?? ""}px)` }), v = Ua(_, "", v, { width: `${(X.compact ? 44 : r()) ?? ""}px` }), b = Ua(y, "", b, { "--opacity": +!!$.open[t.app_id] });
	}, [() => Z(t.app_id), () => Z(t.app_id)]), G("click", u, l), K(e, u), lt(), a();
}
var hl, gl = t((() => {
	Do(), Y(), To(), hc(), vc(), Ic(), Lc(), Oo(), Wo(), fl(), pl(), hl = /* @__PURE__ */ Ni("<button><p> </p> <span class=\"s-1lja36i\"><span class=\"mac-dock-icon s-1lja36i\"></span></span> <div class=\"dot mac-dock-dot s-1lja36i\"></div></button>"), xi(["click"]);
})), _l = t((() => {}));
//#endregion
//#region src/components/Dock/Dock.svelte
function vl(e, t) {
	ct(t, !0);
	let n = /* @__PURE__ */ jn(null), r, i, a, o = /* @__PURE__ */ jn(0);
	function s() {
		if (!a || !i) return;
		let e = (e) => parseFloat(e) || 0, t = getComputedStyle(i), n = e(t.paddingLeft) + e(t.paddingRight) + e(t.borderLeftWidth) + e(t.borderRightWidth), r = 0, s = Infinity;
		for (let t of i.children) {
			let i = getComputedStyle(t), a = e(i.paddingLeft) + e(i.paddingRight) + e(i.borderLeftWidth) + e(i.borderRightWidth) + e(i.marginLeft) + e(i.marginRight);
			t.matches("[data-dock]") ? (n += (X.compact ? 44 : Q) + a, r++, s = Math.min(s, a)) : n += e(i.width) + e(i.marginLeft) + e(i.marginRight);
		}
		let c = Math.max(0, a.clientWidth - 24);
		X.scrollable = n > c + 1, F(o, X.compact || X.scrollable ? 0 : Math.min(1, Math.max(0, c - n - 2) / fc(r, Q + (Number.isFinite(s) ? s : 0))), !0);
	}
	So(() => {
		let e = new ResizeObserver(s);
		return e.observe(a), s(), () => e.disconnect();
	}), dr(() => {
		X.compact, s();
	});
	function c(e) {
		X.scrollable && Math.abs(e.deltaY) > Math.abs(e.deltaX) && (e.preventDefault(), r.scrollLeft += e.deltaY);
	}
	var l = xl();
	let u;
	var d = L(l), f = L(d);
	oa(f, 21, () => Ho, ra, (e, t) => {
		var r = bl(), i = qn(r), a = (e) => {
			K(e, yl());
		};
		$i(i, (e) => {
			V(t).id === "github" && e(a);
		}), ml(R(i, 2), {
			get mouse_x() {
				return V(n);
			},
			get app_id() {
				return V(t).id;
			},
			get magnification() {
				return V(o);
			}
		}), K(e, r);
	}), D(f), so(f, (e) => i = e, () => i), D(d), so(d, (e) => r = e, () => r);
	var p = R(d, 2), m = L(p, !0);
	D(p), D(l), so(l, (e) => a = e, () => a), yr((e, t) => {
		u = Ba(l, 1, "dock-container mac-dock-region s-1jzwqdx", null, u, { "is-scrollable": X.scrollable }), J(f, "aria-label", e), q(m, t);
	}, [() => Z("navigation"), () => Z("dockScroll")]), bi("wheel", d, c), G("pointermove", f, (e) => F(n, e.pointerType === "touch" ? null : e.clientX, !0)), bi("pointerleave", f, () => F(n, null)), G("focusin", f, (e) => {
		X.scrollable && e.target.closest("button")?.scrollIntoView({
			block: "nearest",
			inline: "nearest"
		});
	}), K(e, l), lt();
}
var yl, bl, xl, Sl = t((() => {
	Do(), Y(), To(), Wo(), Oo(), gl(), hc(), _l(), yl = /* @__PURE__ */ Ni("<div class=\"divider s-1jzwqdx\" aria-hidden=\"true\"></div>"), bl = /* @__PURE__ */ Ni("<!> <!>", 1), xl = /* @__PURE__ */ Ni("<section><div class=\"mac-dock-viewport s-1jzwqdx\"><nav class=\"dock-el mac-dock s-1jzwqdx\"></nav></div> <p class=\"dock-scroll-hint s-1jzwqdx\"> </p></section>"), xi(["pointermove", "focusin"]);
}));
//#endregion
//#region src/components/Desktop/ThemeSwitch.svelte
function Cl(e, t) {
	ct(t, !0);
	let n = window.PortfolioTheme, r = /* @__PURE__ */ jn(Bn(n.preference)), i, a, o = [
		"light",
		"dark",
		"system"
	], s = /* @__PURE__ */ Qt(() => X.locale === "en" ? {
		title: "Appearance",
		light: "Light",
		dark: "Dark",
		system: "System",
		hint: "Follow your device settings"
	} : {
		title: "外观",
		light: "浅色",
		dark: "深色",
		system: "跟随系统",
		hint: "随设备外观自动切换"
	});
	async function c(e, t) {
		let r = a.getBoundingClientRect(), o = t.detail ? {
			x: t.clientX,
			y: t.clientY
		} : {
			x: r.x + r.width / 2,
			y: r.y + r.height / 2
		};
		i.open = !1, a.focus(), await Yr(), n.set(e, o);
	}
	So(() => {
		let e = () => F(r, n.preference, !0), t = (e) => {
			i.contains(e.target) || (i.open = !1);
		}, o = (e) => {
			e.key === "Escape" && i.open && (e.preventDefault(), e.stopImmediatePropagation(), i.open = !1, a.focus());
		};
		return document.addEventListener("portfolio:themechange", e), document.addEventListener("pointerdown", t), document.addEventListener("keydown", o, !0), () => {
			document.removeEventListener("portfolio:themechange", e), document.removeEventListener("pointerdown", t), document.removeEventListener("keydown", o, !0);
		};
	});
	var l = Ol(), u = L(l), d = L(u), f = L(d), p = (e) => {
		var t = wl();
		qe(), K(e, t);
	}, m = (e) => {
		K(e, Tl());
	}, h = (e) => {
		var t = El();
		qe(), K(e, t);
	};
	$i(f, (e) => {
		V(r) === "system" ? e(p) : V(r) === "dark" ? e(m, 1) : e(h, -1);
	}), D(d);
	var g = R(d), _ = L(g, !0);
	D(g), D(u), so(u, (e) => a = e, () => a);
	var v = R(u, 2), y = L(v), b = L(y, !0);
	D(y);
	var x = R(y, 2);
	oa(x, 17, () => o, ra, (e, t) => {
		var n = Dl(), i = L(n), a = R(i), o = L(a, !0);
		D(a);
		var l = R(a), u = L(l, !0);
		D(l), D(n), yr(() => {
			J(n, "data-theme-option", V(t)), J(n, "aria-pressed", V(r) === V(t)), Ba(i, 1, `mac-theme-swatch ${V(t) ?? ""}`), q(o, V(s)[V(t)]), q(u, V(r) === V(t) ? "✓" : "");
		}), G("click", n, (e) => c(V(t), e)), K(e, n);
	});
	var S = R(x, 2), C = L(S, !0);
	D(S), D(v), D(l), so(l, (e) => i = e, () => i), yr(() => {
		J(u, "aria-label", `${V(s).title}: ${V(s)[V(r)]}`), J(u, "title", V(s).title), q(_, V(s).title), J(v, "aria-label", V(s).title), q(b, V(s).title), q(C, V(s).hint);
	}), K(e, l), lt();
}
var wl, Tl, El, Dl, Ol, kl = t((() => {
	Do(), Y(), To(), Oo(), wl = /* @__PURE__ */ Fi("<rect x=\"3\" y=\"4\" width=\"18\" height=\"13\" rx=\"2\"></rect><path d=\"M8 21h8m-4-4v4\"></path>", 1), Tl = /* @__PURE__ */ Fi("<path d=\"M20.5 13.1A8.5 8.5 0 0 1 10.9 3.5a8.5 8.5 0 1 0 9.6 9.6Z\"></path>"), El = /* @__PURE__ */ Fi("<circle cx=\"12\" cy=\"12\" r=\"4\"></circle><path d=\"M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5\"></path>", 1), Dl = /* @__PURE__ */ Ni("<button type=\"button\"><span aria-hidden=\"true\"></span><span> </span><span class=\"mac-theme-check\" aria-hidden=\"true\"> </span></button>"), Ol = /* @__PURE__ */ Ni("<details class=\"mac-theme\"><summary data-theme-toggle=\"\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><!></svg><span class=\"mac-theme-label\"> </span></summary> <div class=\"mac-theme-panel\" role=\"group\"><p class=\"mac-theme-heading\"> </p> <!> <p class=\"mac-theme-hint\"> </p></div></details>"), xi(["click"]);
}));
//#endregion
//#region src/components/Desktop/wallpaper/preferences.svelte.ts
function Al() {
	try {
		let e = localStorage.getItem(Nl);
		if (Ml.some((t) => t.id === e)) return e;
	} catch {}
	return "fold";
}
function jl(e) {
	Pl.current = e;
	try {
		localStorage.setItem(Nl, e);
	} catch {}
}
var Ml, Nl, Pl, Fl = t((() => {
	Y(), Ml = [
		{
			id: "fold",
			zh: "流光折叠",
			en: "Prismatic folds",
			colors: [
				"#11143b",
				"#5354ed",
				"#db80eb"
			]
		},
		{
			id: "chrome",
			zh: "液态铬",
			en: "Liquid chrome",
			colors: [
				"#06292f",
				"#3f8895",
				"#bedcd7"
			]
		},
		{
			id: "dunes",
			zh: "赤金沙丘",
			en: "Ember dunes",
			colors: [
				"#30141d",
				"#b34c2f",
				"#e6ad6e"
			]
		},
		{
			id: "aurora",
			zh: "极光幕",
			en: "Aurora veil",
			colors: [
				"#081b2c",
				"#247a74",
				"#8edbb5"
			]
		},
		{
			id: "ocean",
			zh: "日落海面",
			en: "Sunset ocean",
			colors: [
				"#092f40",
				"#397c87",
				"#f2a071"
			]
		},
		{
			id: "nebula",
			zh: "星云流体",
			en: "Nebula flow",
			colors: [
				"#10172f",
				"#68548e",
				"#d48e76"
			]
		},
		{
			id: "ribbons",
			zh: "虹彩丝带",
			en: "Iridescent ribbons",
			colors: [
				"#101329",
				"#b45d85",
				"#91d9c0"
			]
		},
		{
			id: "warp",
			zh: "星际跃迁",
			en: "Hyperspace",
			colors: [
				"#0a122b",
				"#305ca2",
				"#a18ddb"
			]
		}
	], Nl = "portfolio-wallpaper", Pl = Bn({ current: Al() });
})), Il = t((() => {}));
//#endregion
//#region src/components/Desktop/WallpaperSwitch.svelte
function Ll(e, t) {
	ct(t, !0);
	let n, r, i = /* @__PURE__ */ Qt(() => X.locale === "en" ? "Wallpaper" : "壁纸"), a = /* @__PURE__ */ Qt(() => Ml.find((e) => e.id === Pl.current));
	function o(e) {
		jl(e), n.open = !1, r.focus();
	}
	So(() => {
		let e = (e) => {
			n.contains(e.target) || (n.open = !1);
		}, t = (e) => {
			e.key === "Escape" && n.open && (e.preventDefault(), e.stopImmediatePropagation(), n.open = !1, r.focus());
		};
		return document.addEventListener("pointerdown", e), document.addEventListener("keydown", t, !0), () => {
			document.removeEventListener("pointerdown", e), document.removeEventListener("keydown", t, !0);
		};
	});
	var s = zl(), c = L(s), l = R(L(c)), u = L(l, !0);
	D(l), D(c), so(c, (e) => r = e, () => r);
	var d = R(c, 2);
	oa(d, 21, () => Ml, ra, (e, t) => {
		var n = Rl(), r = L(n), i = R(r, 2), a = L(i, !0), s = R(a), c = L(s, !0);
		D(s), D(i), D(n), yr(() => {
			J(n, "data-wallpaper-option", V(t).id), J(n, "aria-label", X.locale === "en" ? V(t).en : V(t).zh), J(n, "aria-pressed", Pl.current === V(t).id), Ba(r, 1, `wallpaper-preview ${V(t).id ?? ""}`, "s-imhxqg"), Ua(r, `--base:${V(t).colors[0]};--mid:${V(t).colors[1]};--light:${V(t).colors[2]}`), q(a, X.locale === "en" ? V(t).en : V(t).zh), q(c, Pl.current === V(t).id ? "✓" : "");
		}), G("click", n, () => o(V(t).id)), K(e, n);
	}), D(d), D(s), so(s, (e) => n = e, () => n), yr(() => {
		J(c, "aria-label", `${V(i)}: ${X.locale === "en" ? V(a).en : V(a).zh}`), J(c, "title", V(i)), q(u, V(i)), J(d, "aria-label", V(i));
	}), K(e, s), lt();
}
var Rl, zl, Bl = t((() => {
	Do(), Y(), To(), Oo(), Fl(), Il(), Rl = /* @__PURE__ */ Ni("<button type=\"button\" class=\"s-imhxqg\"><span aria-hidden=\"true\"><span class=\"s-imhxqg\"></span></span> <span class=\"wallpaper-name s-imhxqg\"> <span aria-hidden=\"true\"> </span></span></button>"), zl = /* @__PURE__ */ Ni("<details class=\"wallpaper-picker s-imhxqg\"><summary data-wallpaper-toggle=\"\" class=\"s-imhxqg\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"></rect><circle cx=\"9\" cy=\"9\" r=\"1.5\"></circle><path d=\"m4 17 5-5 4 4 3-3 5 5\"></path></svg><span class=\"picker-label s-imhxqg\"> </span></summary> <div class=\"wallpaper-panel s-imhxqg\" role=\"group\"></div></details>"), xi(["click"]);
})), Vl = t((() => {
	rt(), et();
}));
//#endregion
//#region node_modules/@neodrag/core/dist/chunk-4ZITEWYV.js
function Hl(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Ul(e, t, n) {
	e.style.setProperty(t.toString(), n?.toString() ?? "");
}
function Wl(e, t) {
	return e.style.getPropertyValue(t.toString());
}
function Gl(e, t, n) {
	e.setAttribute(`data-${t}`, n + "");
}
function Kl(e) {
	return e instanceof SVGElement;
}
function ql(e) {
	return e instanceof SVGSVGElement;
}
function Jl(e) {
	return e;
}
function Yl(e, t) {
	let n = e.rootNode instanceof SVGElement;
	e.effect.paint(() => {
		if (t) return t({
			offset: { ...e.offset },
			rootNode: e.rootNode
		});
		if (n) {
			let t = e.rootNode, n = t.ownerSVGElement;
			if (!n) return;
			let r = n.createSVGTransform();
			r.setTranslate(e.offset.x, e.offset.y);
			let i = t.transform.baseVal;
			i.clear(), i.appendItem(r);
		} else Ul(e.rootNode, "translate", `${e.offset.x}px ${e.offset.y}px 0.000000001px`);
	});
}
function Xl(e, t, n) {
	if (e[1][0] - e[0][0] < t || e[1][1] - e[0][1] < n) throw Error("Bounds dimensions cannot be smaller than the draggable element dimensions");
}
function Zl(e, t) {
	return e.area < t.area && e.left >= t.left && e.right <= t.right && e.top >= t.top && e.bottom <= t.bottom;
}
function Ql(e, t, n) {
	return n.filter((n) => $l(t.clientX, t.clientY, n, e.cachedRootNodeRect)).sort((e, t) => e.area - t.area);
}
function $l(e, t, n, r) {
	let i = e - r.left, a = t - r.top;
	return i >= n.left && i <= n.right && a >= n.top && a <= n.bottom;
}
var eu, tu, nu, ru, iu, au, ou, su, cu, lu, uu, du, fu, pu, mu, hu, gu = t((() => {
	eu = (e) => Object.is(e, null), tu = class {
		#e;
		#t;
		#n = !1;
		constructor(e) {
			this.#e = e ? e() : void 0, this.#t = /* @__PURE__ */ new Set();
		}
		get current() {
			return this.#e;
		}
		set current(e) {
			e !== this.#e && (this.#n ||= (this.#n = !0, this.#e = e, this.#t.forEach((t) => t(e)), !1));
		}
		subscribe(e) {
			return this.#t.add(e), () => this.#t.delete(e);
		}
	}, nu = Jl((e = !0) => ({
		name: "neodrag:ignoreMultitouch",
		setup() {
			return { active_pointers: /* @__PURE__ */ new Set() };
		},
		start(t, n, r) {
			t.effect.paint(() => {
				n.active_pointers.add(r.pointerId), e && n.active_pointers.size > 1 && r.preventDefault();
			});
		},
		drag(t, n) {
			e && n.active_pointers.size > 1 && t.cancel();
		},
		end(e, t, n) {
			t.active_pointers.delete(n.pointerId);
		}
	})), ru = Jl(() => ({
		name: "neodrag:stateMarker",
		cancelable: !1,
		setup(e) {
			return Gl(e.rootNode, "neodrag", ""), Gl(e.rootNode, "neodrag-state", "idle"), Gl(e.rootNode, "neodrag-count", "0"), { count: 0 };
		},
		start(e) {
			e.effect.paint(() => {
				Gl(e.rootNode, "neodrag-state", "dragging");
			});
		},
		end(e, t) {
			Gl(e.rootNode, "neodrag-state", "idle"), Gl(e.rootNode, "neodrag-count", ++t.count);
		}
	})), iu = Jl((e = !0) => ({
		name: "neodrag:applyUserSelectHack",
		cancelable: !1,
		setup() {
			return { body_user_select_val: "" };
		},
		start(t, n) {
			t.effect.paint(() => {
				e && (n.body_user_select_val = Wl(document.body, "user-select") ?? document.body.style.webkitUserSelect ?? "", Ul(document.body, "user-select", "none"), document.body.style.webkitUserSelect = "none");
			});
		},
		end(t, n) {
			e && (Ul(document.body, "user-select", n.body_user_select_val), document.body.style.webkitUserSelect = n.body_user_select_val);
		}
	})), au = Jl((e = !0) => ({
		name: "neodrag:disabled",
		shouldStart() {
			return !e;
		}
	})), ou = Jl((e) => ({
		name: "neodrag:transform",
		priority: -1e3,
		cancelable: !1,
		liveUpdate: !0,
		setup(t) {
			Yl(t, e);
		},
		drag(t) {
			Yl(t, e);
		}
	})), su = {
		element(e, t) {
			return () => {
				let n = e.getBoundingClientRect();
				if (n.left === 0 && n.right === 0 && n.top === 0 && n.bottom === 0) throw Error("bounds element has no dimensions. This may happen due to display:contents");
				return [[n.left + (t?.left ?? 0), n.top + (t?.top ?? 0)], [n.right - (t?.right ?? 0), n.bottom - (t?.bottom ?? 0)]];
			};
		},
		selector(e, t, n) {
			return (r) => {
				let i = (n ?? document).querySelector(e);
				if (!i) throw Error(`bounds selector ${e} did not match any elements in the DOM`);
				return su.element(i, t)(r);
			};
		},
		viewport(e) {
			return (t) => {
				let n = {
					top: 0 + (e?.top ?? 0),
					left: 0 + (e?.left ?? 0),
					right: window.innerWidth - (e?.right ?? 0),
					bottom: window.innerHeight - (e?.bottom ?? 0)
				};
				if (n.right <= n.left || n.bottom <= n.top) throw Error("Viewport bounds are invalid after applying padding. Check your padding values.");
				return [[n.left, n.top], [n.right, n.bottom]];
			};
		},
		parent(e) {
			return (t) => su.element(t.root_node.parentElement, e)(t);
		}
	}, cu = (e, t, n) => Math.min(n, Math.max(t, e)), lu = Jl((e = () => [[0, 0], [0, 0]], t = (e) => e.hook === "start") => ({
		name: "neodrag:bounds",
		setup(n) {
			let r;
			r = t?.({ hook: "setup" }) ? e({ root_node: n.rootNode }) : [[0, 0], [window.innerWidth, window.innerHeight]];
			let i = n.cachedRootNodeRect.width, a = n.cachedRootNodeRect.height;
			return Xl(r, i, a), {
				bounds: r,
				initialElementPosition: {
					x: n.cachedRootNodeRect.left - n.offset.x,
					y: n.cachedRootNodeRect.top - n.offset.y
				}
			};
		},
		start(n, r) {
			if (t?.({ hook: "start" })) {
				let t = e({ root_node: n.rootNode }), i = n.cachedRootNodeRect.width, a = n.cachedRootNodeRect.height;
				Xl(t, i, a), r.bounds = t, r.initialElementPosition = {
					x: n.cachedRootNodeRect.left - n.offset.x,
					y: n.cachedRootNodeRect.top - n.offset.y
				};
			}
		},
		drag(n, r) {
			if (!n.isDragging) return;
			if (t?.({ hook: "drag" })) {
				let t = e({ root_node: n.rootNode }), i = n.cachedRootNodeRect.width, a = n.cachedRootNodeRect.height;
				Xl(t, i, a), r.bounds = t;
			}
			let i = r.bounds, a = n.cachedRootNodeRect.width, o = n.cachedRootNodeRect.height, s = i[0][0], c = i[0][1], l = i[1][0] - a, u = i[1][1] - o, d = r.initialElementPosition, f = s - d.x, p = c - d.y, m = l - d.x, h = u - d.y, g = n.offset.x + (n.proposed.x ?? 0), _ = n.offset.y + (n.proposed.y ?? 0), v = cu(g, f, m), y = cu(_, p, h), b = v - n.offset.x, x = y - n.offset.y;
			n.propose(n.proposed.x === null ? null : b, n.proposed.y === null ? null : x);
		},
		end(n, r) {
			if (t?.({ hook: "end" })) {
				let t = e({ root_node: n.rootNode }), i = n.cachedRootNodeRect.width, a = n.cachedRootNodeRect.height;
				Xl(t, i, a), r.bounds = t;
			}
		}
	})), uu = Jl((e) => ({
		name: "neodrag:threshold",
		setup() {
			let t = !eu(e);
			if (!t) return { enabled: t };
			let n = { ...e ?? {} };
			if (n.delay ??= 0, n.distance ??= 3, n.delay < 0) throw Error("delay must be >= 0");
			if (n.distance < 0) throw Error("distance must be >= 0");
			return {
				enabled: t,
				start_time: 0,
				start_position: {
					x: 0,
					y: 0
				},
				options: n
			};
		},
		shouldStart(e, t, n) {
			return t.enabled && (t.start_time = Date.now(), t.start_position.x = n.clientX, t.start_position.y = n.clientY), !0;
		},
		drag(e, t, n) {
			if (t.enabled && !e.isDragging) {
				if (!e.currentlyDraggedNode.contains(n.target)) {
					e.preventStart();
					return;
				}
				if (t.options.delay && Date.now() - t.start_time < t.options.delay) {
					e.preventStart();
					return;
				}
				if (t.options.distance) {
					let r = n.clientX - t.start_position.x, i = n.clientY - t.start_position.y;
					if (r ** 2 + i ** 2 <= t.options.distance ** 2) {
						e.preventStart();
						return;
					}
				}
			}
		}
	})), du = Jl((e = {}) => ({
		name: "neodrag:events",
		cancelable: !1,
		liveUpdate: !1,
		setup(e) {
			return {
				offset: e.offset,
				rootNode: e.rootNode,
				currentNode: e.currentlyDraggedNode,
				event: e.lastEvent
			};
		},
		start(t, n, r) {
			t.effect.immediate(() => {
				n.offset = t.offset, n.currentNode = t.currentlyDraggedNode, n.event = r, e.onDragStart?.(n);
			});
		},
		drag(t, n, r) {
			t.effect.immediate(() => {
				n.offset = t.offset, n.currentNode = t.currentlyDraggedNode, n.event = r, e.onDrag?.(n);
			});
		},
		end(t, n, r) {
			t.effect.immediate(() => {
				n.offset = t.offset, n.currentNode = t.currentlyDraggedNode, n.event = r, e.onDragEnd?.(n);
			});
		}
	})), fu = {
		selector(e) {
			return (t) => fu.elements(t.querySelectorAll(e))(t);
		},
		elements: (e) => (t) => {
			let n = t.getBoundingClientRect(), r = [];
			for (let t of Array.from(e)) {
				if (!t) continue;
				let e = t.getBoundingClientRect();
				r.push({
					element: t,
					top: e.top - n.top,
					right: e.right - n.left,
					bottom: e.bottom - n.top,
					left: e.left - n.left,
					area: e.width * e.height
				});
			}
			return r;
		}
	}, pu = Jl((e, t = (e) => e.hook === "setup") => ({
		name: "neodrag:controls",
		setup(t) {
			let n = () => ({
				allow_zones: (e?.allow?.(t.rootNode) ?? []).sort((e, t) => e.area - t.area),
				block_zones: (e?.block?.(t.rootNode) ?? []).sort((e, t) => e.area - t.area)
			}), { allow_zones: r, block_zones: i } = n();
			return {
				allow_zones: r,
				block_zones: i,
				priority: e?.priority ?? "allow",
				allow_fn: e?.allow,
				block_fn: e?.block,
				compute_zones: n
			};
		},
		start(e, n) {
			if (t({ hook: "start" })) {
				let { allow_zones: e, block_zones: t } = n.compute_zones();
				n.allow_zones = e, n.block_zones = t;
			}
		},
		drag(e, n) {
			if (e.isDragging && t({ hook: "drag" })) {
				let { allow_zones: e, block_zones: t } = n.compute_zones();
				n.allow_zones = e, n.block_zones = t;
			}
		},
		end(e, n) {
			if (t({ hook: "end" })) {
				let { allow_zones: e, block_zones: t } = n.compute_zones();
				n.allow_zones = e, n.block_zones = t;
			}
		},
		shouldStart(e, t, n) {
			let r = Ql(e, n, t.allow_zones), i = Ql(e, n, t.block_zones);
			if (t.allow_zones.length > 0 && r.length === 0) return !1;
			if (r.length === 0 && i.length === 0) return t.allow_zones.length === 0;
			let a = null, o = !1, s = 0, c = 0;
			for (; s < r.length || c < i.length;) {
				let e = r[s], t = i[c];
				if (!e) {
					a = t, o = !1;
					break;
				}
				if (!t) {
					a = e, o = !0;
					break;
				}
				if (Zl(e, t)) {
					a = e, o = !0;
					break;
				}
				if (Zl(t, e)) {
					a = t, o = !1;
					break;
				}
				e.area <= t.area ? (a = e, o = !0, s++) : (a = t, o = !1, c++);
			}
			return a ? o ? (e.currentlyDraggedNode = a.element, !0) : !1 : t.allow_zones.length === 0;
		}
	})), mu = Jl((e = null) => ({
		name: "neodrag:position",
		priority: 1e3,
		liveUpdate: !0,
		setup(t) {
			if (!t.isInteracting) {
				let n = e?.current?.x ?? e?.default?.x ?? t.offset.x, r = e?.current?.y ?? e?.default?.y ?? t.offset.y;
				(n !== t.offset.x || r !== t.offset.y) && t.setForcedPosition(n, r);
			}
		}
	})), hu = Jl((e = "none") => ({
		name: "neodrag:touch-action",
		cancelable: !1,
		liveUpdate: !0,
		setup(t) {
			e !== !1 && e !== null && Ul(t.rootNode, "touch-action", e ?? "none");
		}
	}));
})), _u, vu, yu = t((() => {
	gu(), _u = {
		plugins: [
			nu(),
			ru(),
			iu(),
			ou(),
			uu(),
			hu()
		],
		onError: (e) => {
			console.error(e);
		},
		delegate: () => document.documentElement
	}, vu = class {
		#e = /* @__PURE__ */ new Map();
		#t = !1;
		#n = /* @__PURE__ */ new Map();
		#r = null;
		#i = null;
		#a;
		#o;
		#s;
		constructor({ plugins: e, delegate: t, onError: n }) {
			this.#a = e, this.#o = t, this.#s = n;
		}
		get instances() {
			return this.#e;
		}
		draggable(e, t = []) {
			if (ql(e)) throw Error("Dragging the root SVG element directly is not recommended. Instead, either:\n1. Wrap your SVG in a div and make the div draggable\n2. Use viewBox manipulation if you want to pan the SVG canvas\n3. Or if you really need to transform the SVG element, use CSS transforms");
			this.#u();
			let n = this.#d(e, t);
			this.#e.set(e, n);
			let r = this.#f(n, t);
			return () => {
				r(), this.#w(n);
			};
		}
		dispose() {
			for (let e of this.#e.values()) this.#w(e);
		}
		#c(e, t) {
			try {
				return {
					ok: !0,
					value: e()
				};
			} catch (e) {
				return this.#l(t, e), {
					ok: !1,
					error: e
				};
			}
		}
		#l(e, t) {
			this.#s && this.#s({
				...e,
				error: t
			});
		}
		#u() {
			if (this.#t) return;
			let e = this.#o();
			Hl(e, "pointerdown", this.#v.bind(this), {
				passive: !0,
				capture: !1
			}), Hl(e, "pointermove", this.#y.bind(this), {
				passive: !1,
				capture: !1
			}), Hl(e, "pointerup", this.#b.bind(this), {
				passive: !0,
				capture: !1
			}), Hl(e, "pointercancel", this.#b.bind(this), {
				passive: !0,
				capture: !1
			}), this.#t = !0;
		}
		#d(e, t) {
			let n = {
				ctx: {},
				root_node: e,
				plugins: [],
				states: /* @__PURE__ */ new Map(),
				controller: new AbortController(),
				failed_plugins: /* @__PURE__ */ new Set(),
				dragstart_prevented: !1,
				current_drag_hook_cancelled: !1,
				pointer_captured_id: null,
				inverse_scale: 1,
				effects: {
					immediate: /* @__PURE__ */ new Set(),
					paint: /* @__PURE__ */ new Set()
				},
				compartments: {
					map: /* @__PURE__ */ new Map(),
					pending: /* @__PURE__ */ new Set(),
					is_flushing: !1
				},
				resolver: typeof t == "function" ? t : void 0,
				is_processing_external_update: !1
			}, r = e;
			return n.ctx = {
				proposed: {
					x: 0,
					y: 0
				},
				delta: {
					x: 0,
					y: 0
				},
				offset: {
					x: 0,
					y: 0
				},
				initial: {
					x: 0,
					y: 0
				},
				isDragging: !1,
				isInteracting: !1,
				rootNode: e,
				cachedRootNodeRect: e.getBoundingClientRect(),
				lastEvent: null,
				get currentlyDraggedNode() {
					return r;
				},
				set currentlyDraggedNode(e) {
					n.pointer_captured_id && r.hasPointerCapture(n.pointer_captured_id) && (r.releasePointerCapture(n.pointer_captured_id), e.setPointerCapture(n.pointer_captured_id)), r = e;
				},
				effect: {
					immediate: (e) => {
						n.effects.immediate.add(e);
					},
					paint: (e) => {
						n.effects.paint.add(e);
					}
				},
				propose(e, t) {
					this.proposed.x = e, this.proposed.y = t;
				},
				cancel() {
					n.current_drag_hook_cancelled = !0;
				},
				preventStart() {
					n.dragstart_prevented = !0;
				},
				setForcedPosition(e, t) {
					this.offset.x = e, this.offset.y = t;
				}
			}, n;
		}
		#f(e, t) {
			let n = /* @__PURE__ */ new Set();
			if (typeof t == "function") {
				let r = t(), i = this.#m(r, e.compartments.map);
				e.plugins = this.#p(i);
				for (let t of r) t instanceof tu && n.add(t.subscribe(() => {
					e.compartments.pending.add(t), this.#T(e, !0);
				}));
			} else e.plugins = this.#p(t);
			for (let t of e.plugins) this.#c(() => {
				let n = t.setup?.(e.ctx);
				n && e.states.set(t.name, n), this.#g(e);
			}, {
				phase: "setup",
				plugin: {
					name: t.name,
					hook: "setup"
				},
				node: e.root_node
			}).ok || e.failed_plugins.add(t.name);
			return () => {
				n.forEach((e) => e()), n.clear();
			};
		}
		#p(e) {
			let t = this.#a.concat(e);
			return Array.from(t.sort((e, t) => (t.priority ?? 0) - (e.priority ?? 0)).reduce((e, t) => (e.set(t.name, t), e), /* @__PURE__ */ new Map()).values());
		}
		#m(e, t) {
			return e.map((e) => {
				if (e instanceof tu) {
					let n = e.current;
					return t.set(e, n), n;
				}
				return e;
			}).filter((e) => e != null);
		}
		#h(e, t, n) {
			let r = !0;
			e.dragstart_prevented = !1;
			for (let i of e.plugins) {
				if (e.failed_plugins.has(i.name)) continue;
				let a = i[t];
				if (!a || e.current_drag_hook_cancelled && i.cancelable) continue;
				let o = this.#c(() => a.call(i, e.ctx, e.states.get(i.name), n), {
					phase: t,
					plugin: {
						name: i.name,
						hook: t
					},
					node: e.ctx.rootNode
				});
				if (!o.ok) {
					e.failed_plugins.add(i.name), r = !1;
					break;
				}
				if (o.value === !1) {
					r = !1;
					break;
				}
			}
			return r;
		}
		#g(e) {
			let t = new Set(e.effects.paint), n = new Set(e.effects.immediate);
			this.#_(e), queueMicrotask(() => {
				for (let e of n) e();
			}), requestAnimationFrame(() => {
				for (let e of t) e();
			});
		}
		#_(e) {
			e.effects.immediate.clear(), e.effects.paint.clear();
		}
		#v(e) {
			if (e.button === 2) return;
			let t = this.#x(e);
			if (!t) return;
			let n = this.#e.get(t);
			n && (n.ctx.cachedRootNodeRect = t.getBoundingClientRect(), n.inverse_scale = this.#C(n), n.ctx.initial.x = e.clientX - n.ctx.offset.x / n.inverse_scale, n.ctx.initial.y = e.clientY - n.ctx.offset.y / n.inverse_scale, this.#h(n, "shouldStart", e) && (n.ctx.isInteracting = !0, this.#n.set(e.pointerId, t)));
		}
		#y(e, t = !1) {
			let n = this.#n.get(e.pointerId);
			if (!n) return;
			let r = this.#e.get(n);
			if (r.ctx.isInteracting && !(r.is_processing_external_update && r.ctx.lastEvent === e)) {
				if (r.ctx.lastEvent = e, !r.ctx.isDragging) {
					if (r.dragstart_prevented = !1, this.#h(r, "drag", e), !r.dragstart_prevented) {
						if (this.#h(r, "start", e)) this.#g(r);
						else return this.#_(r);
						this.#c(() => {
							r.pointer_captured_id = e.pointerId, r.ctx.currentlyDraggedNode.setPointerCapture(r.pointer_captured_id);
						}, {
							phase: "start",
							node: r.ctx.currentlyDraggedNode
						}).ok || this.#S(e.pointerId), r.ctx.isDragging = !0;
					}
					if (!r.ctx.isDragging) return;
				}
				if (e.preventDefault(), !t) {
					let t = (e.clientX - r.ctx.initial.x) * r.inverse_scale, n = (e.clientY - r.ctx.initial.y) * r.inverse_scale;
					r.ctx.delta.x = t - r.ctx.offset.x, r.ctx.delta.y = n - r.ctx.offset.y, r.ctx.proposed.x = r.ctx.delta.x, r.ctx.proposed.y = r.ctx.delta.y;
				}
				if (this.#h(r, "drag", e)) this.#g(r);
				else return this.#_(r);
				t || (r.ctx.offset.x += r.ctx.proposed.x ?? 0, r.ctx.offset.y += r.ctx.proposed.y ?? 0);
			}
		}
		#b(e) {
			let t = this.#n.get(e.pointerId);
			if (!t) return;
			let n = this.#e.get(t);
			n.ctx.isInteracting && (n.ctx.isDragging && Hl(t, "click", (e) => e.stopPropagation(), {
				once: !0,
				signal: n.controller.signal,
				capture: !0
			}), n.pointer_captured_id && n.ctx.currentlyDraggedNode.hasPointerCapture(n.pointer_captured_id) && n.ctx.currentlyDraggedNode.releasePointerCapture(n.pointer_captured_id), this.#h(n, "end", e), this.#g(n), n.ctx.proposed.x !== null && (n.ctx.initial.x = e.clientX - n.ctx.offset.x / n.inverse_scale), n.ctx.proposed.y !== null && (n.ctx.initial.y = e.clientY - n.ctx.offset.y / n.inverse_scale), n.ctx.proposed.x = 0, n.ctx.proposed.y = 0, n.ctx.isInteracting = !1, n.ctx.isDragging = !1, n.dragstart_prevented = !1, n.pointer_captured_id = null, this.#_(n));
		}
		#x(e) {
			let t = e.target;
			if (t === this.#r) return this.#i;
			let n = e.composedPath(), r = Math.min(n.length, 20);
			for (let e = 0; e < r; e++) {
				let r = n[e];
				if ((r instanceof HTMLElement || Kl(r) && !ql(r)) && this.#e.has(r)) return this.#r = t, this.#i = r, this.#i;
				if (r === document || r === document.body) break;
			}
			return this.#r = t, this.#i = null, null;
		}
		#S(e) {
			let t = this.#n.get(e);
			if (!t) return;
			let n = this.#e.get(t);
			n && (n.pointer_captured_id && n.ctx.currentlyDraggedNode.hasPointerCapture(n.pointer_captured_id) && this.#c(() => {
				n.ctx.currentlyDraggedNode.releasePointerCapture(n.pointer_captured_id);
			}, {
				phase: "end",
				node: t
			}), n.ctx.isInteracting = !1, n.ctx.isDragging = !1, n.dragstart_prevented = !1, n.pointer_captured_id = null, this.#n.delete(e), this.#_(n));
		}
		#C(e) {
			let t = e.ctx.rootNode, n = 1;
			if (t instanceof SVGElement) {
				let r = t.getBBox(), i = e.ctx.cachedRootNodeRect;
				r.width && i.width && (n = r.width / i.width);
			} else n = t.offsetWidth / e.ctx.cachedRootNodeRect.width;
			return (isNaN(n) || n <= 0) && (n = 1), n;
		}
		#w(e) {
			for (let [t, n] of this.#n) n === e.root_node && this.#S(t);
			for (let t of e.plugins) t.cleanup?.(e.ctx, e.states.get(t.name));
			e.controller.abort(), this.instances.delete(e.root_node);
		}
		#T(e, t = !1) {
			e.compartments.is_flushing || e.compartments.pending.size === 0 || !t && e.is_processing_external_update || (e.compartments.is_flushing = !0, t && (e.is_processing_external_update = !0), queueMicrotask(() => {
				let n = new Set(e.compartments.pending);
				e.compartments.pending.clear(), e.compartments.is_flushing = !1;
				let r = !1;
				for (let t of n) {
					let n = t.current, i = e.plugins.find((n) => n === e.compartments.map.get(t));
					if (i) if (n == null) {
						let n = e.plugins.indexOf(i);
						i.cleanup?.(e.ctx, e.states.get(i.name)), e.states.delete(i.name), e.plugins.splice(n, 1), e.compartments.map.set(t, void 0), r = !0;
					} else {
						if (i === n && !n.liveUpdate) continue;
						e.plugins[e.plugins.indexOf(i)] = n, e.compartments.map.set(t, n);
						for (let t of e.plugins) if (t.liveUpdate) {
							let n = e.plugins.find((e) => e.name === t.name);
							this.#E(e, n, t) && (r = !0);
						}
					}
					else if (n != null) {
						e.plugins.push(n), e.compartments.map.set(t, n), this.#c(() => {
							let t = n.setup?.(e.ctx);
							return t && e.states.set(n.name, t), t;
						}, {
							phase: "setup",
							plugin: {
								name: n.name,
								hook: "setup"
							},
							node: e.root_node
						}).ok || e.failed_plugins.add(n.name);
						for (let t of e.plugins) if (t.liveUpdate && t !== n) {
							let n = e.plugins.find((e) => e.name === t.name);
							this.#E(e, n, t) && (r = !0);
						}
						r = !0;
					}
				}
				t && !e.ctx.isDragging && r && e.ctx.lastEvent && this.#y(e.ctx.lastEvent, !0), e.compartments.is_flushing = !1, t && (e.is_processing_external_update = !1), this.#g(e), e.compartments.pending.size > 0 && setTimeout(() => {
					this.#T(e, !1);
				}, 0);
			}));
		}
		#E(e, t, n) {
			if (t === n && !n.liveUpdate) return !1;
			t && t !== n && (t.cleanup?.(e.ctx, e.states.get(t.name)), e.states.delete(t.name));
			let r = n.setup?.(e.ctx);
			return r && e.states.set(n.name, r), !0;
		}
	};
})), bu, xu = t((() => {
	yu(), bu = new vu(_u);
})), Su = t((() => {
	gu();
}));
//#endregion
//#region node_modules/@neodrag/svelte/dist/index.svelte.js
function Cu(e) {
	let t = mr(e);
	function n() {
		t !== null && (t(), t = null);
	}
	try {
		Co(n);
	} catch {}
	return n;
}
var wu, Tu, Eu, Du = t((() => {
	Y(), xu(), Su(), Su(), To(), wu = (e) => (t) => (n) => e.draggable(n, t), Tu = wu(bu), bu.instances, Eu = class extends tu {
		static of(e) {
			let t = new tu(e);
			return Cu(() => {
				pr(() => {
					t.current = e?.();
				});
			}), t;
		}
	};
}));
//#endregion
//#region src/components/SVG/traffic-lights/CloseSVG.svelte
function Ou(e) {
	K(e, ku());
}
var ku, Au = t((() => {
	Do(), Vl(), Y(), ku = /* @__PURE__ */ Fi("<svg width=\"7\" height=\"7\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path stroke=\"#000\" stroke-width=\"1.2\" stroke-linecap=\"round\" d=\"M1.182 5.99L5.99 1.182m0 4.95L1.182 1.323\"></path></svg>");
}));
//#endregion
//#region src/components/SVG/traffic-lights/ExpandSVG.svelte
function ju(e) {
	K(e, Mu());
}
var Mu, Nu = t((() => {
	Do(), Vl(), Y(), Mu = /* @__PURE__ */ Fi("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 12.88 12.88\"><circle cx=\"6.44\" cy=\"6.44\" r=\"6.44\" fill=\"none\"></circle><path d=\"M6.5,3.34V9.66M9.66,6.5H3.34\" fill=\"none\" stroke=\"black\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path></svg>");
}));
//#endregion
//#region src/components/SVG/traffic-lights/StretchSVG.svelte
function Pu(e) {
	var t = Fu(), n = R(L(t));
	J(n, "cx", 6.438), J(n, "cy", 6.438), J(n, "r", 6.438), D(t), K(e, t);
}
var Fu, Iu = t((() => {
	Do(), Vl(), Y(), Fu = /* @__PURE__ */ Fi("<svg viewBox=\"0 0 13 13\" xmlns=\"http://www.w3.org/2000/svg\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" stroke-linejoin=\"round\" stroke-miterlimit=\"2\"><path d=\"M4.871 3.553L9.37 8.098V3.553H4.871zm3.134 5.769L3.506 4.777v4.545h4.499z\"></path><circle fill=\"none\"></circle></svg>");
}));
//#endregion
//#region src/components/SVG/traffic-lights/GreenLight.svelte
function Lu(e, t) {
	let n = ho(t, "expandable", 8);
	var r = Ii(), i = qn(r), a = (e) => {
		ju(e, {});
	}, o = (e) => {
		Pu(e, {});
	};
	$i(i, (e) => {
		n() ? e(a) : e(o, -1);
	}), K(e, r);
}
var Ru = t((() => {
	Do(), Vl(), Y(), Nu(), Iu();
}));
//#endregion
//#region src/components/SVG/traffic-lights/MinimizeSVG.svelte
function zu(e) {
	var t = Bu();
	J(t, "width", 6), J(t, "height", 1), J(L(t), "stroke-width", 2), D(t), K(e, t);
}
var Bu, Vu = t((() => {
	Do(), Vl(), Y(), Bu = /* @__PURE__ */ Fi("<svg fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path stroke=\"#000\" stroke-linecap=\"round\" d=\"M.61.703h5.8\"></path></svg>");
})), Hu = t((() => {}));
//#endregion
//#region src/components/Desktop/Window/TrafficLights.svelte
function Uu(e, t) {
	ct(t, !0);
	var n = Wu();
	let r;
	var i = L(n);
	Ou(L(i), {}), D(i);
	var a = R(i, 2);
	zu(L(a), {}), D(a);
	var o = R(a, 2);
	Lu(L(o), { get expandable() {
		return Uo[t.app_id].expandable;
	} }), D(o), D(n), yr((e, s, c) => {
		r = Ba(n, 1, "container s-14ulm6f", null, r, { unfocused: $.active !== t.app_id }), J(i, "aria-label", e), J(a, "aria-label", s), J(o, "aria-label", c);
	}, [
		() => Z("close"),
		() => Z("minimize"),
		() => Z("maximize")
	]), G("click", i, function(...e) {
		t.on_close_app?.apply(this, e);
	}), G("click", a, function(...e) {
		t.on_minimize_click?.apply(this, e);
	}), G("click", o, function(...e) {
		t.on_maximize_click?.apply(this, e);
	}), K(e, n), lt();
}
var Wu, Gu = t((() => {
	Do(), Y(), Au(), Ru(), Vu(), Wo(), Lc(), Hu(), Wu = /* @__PURE__ */ Ni("<div><button class=\"close-light s-14ulm6f\" data-window-action=\"close\"><!></button> <button class=\"minimize-light s-14ulm6f\" data-window-action=\"minimize\"><!></button> <button class=\"stretch-light s-14ulm6f\" data-window-action=\"maximize\"><!></button></div>"), xi(["click"]);
})), Ku = t((() => {}));
//#endregion
//#region src/components/Desktop/Window/Window.svelte
function qu(e, t) {
	ct(t, !0);
	let n, r = /* @__PURE__ */ jn(!1), i = "", a = Math.min(1050, innerWidth - (innerWidth <= 720 ? 14 : 80)), o = Math.min(720, innerHeight - 170), s = Vo.findIndex((e) => e.id === t.app_id) % 4 * 7, c = {
		x: Math.max(7, (innerWidth - a) / 2 + s),
		y: Math.max(43, (innerHeight - o) / 2 - 40 + s)
	}, l = new Eu();
	dr(() => {
		$.open[t.app_id], $.minimized[t.app_id], V(r), Yr().then(() => {
			l.current = {
				...pu({
					allow: fu.selector(".app-window-drag-handle"),
					block: fu.selector("button")
				}),
				liveUpdate: !0
			};
		});
	});
	let u = Eu.of(() => mu({ default: c })), d = Eu.of(() => au(V(r) || X.compact));
	function f() {
		n && (Hc(t.app_id), V(r) ? n.style.transform = i : (i = n.style.transform, n.style.transform = "translate(0px,0px)"), F(r, !V(r)), $.fullscreen[t.app_id] = V(r));
	}
	dr(() => {
		!$.open[t.app_id] && V(r) && (n && (n.style.transform = i), F(r, !1));
	}), So(() => {
		let e = () => {
			Hc(t.app_id);
			let e = Math.min(1050, innerWidth - (innerWidth <= 720 ? 14 : 80)), n = Math.min(720, innerHeight - 170);
			l.current = {
				...pu({
					allow: fu.selector(".app-window-drag-handle"),
					block: fu.selector("button")
				}),
				liveUpdate: !0
			}, u.current = mu({ current: {
				x: Math.max(7, (innerWidth - e) / 2 + s),
				y: Math.max(43, (innerHeight - n) / 2 - 40 + s)
			} });
		}, r = () => {
			l.current = {
				...pu({
					allow: fu.selector(".app-window-drag-handle"),
					block: fu.selector("button")
				}),
				liveUpdate: !0
			};
		};
		return n.addEventListener("window-motion-settled", r), window.addEventListener("resize", e), () => {
			window.removeEventListener("resize", e), n.removeEventListener("window-motion-settled", r);
		};
	});
	function p() {
		nl(t.app_id), $.is_being_dragged = !0;
	}
	function m() {
		$.is_being_dragged = !1;
	}
	var h = Ju();
	let g, _;
	var v = L(h), y = L(v), b = L(y);
	Uu(b, {
		get app_id() {
			return t.app_id;
		},
		on_close_app: () => al(t.app_id),
		on_minimize_click: () => al(t.app_id, !0),
		on_maximize_click: f
	});
	var x = R(b, 2), S = L(x, !0);
	D(x), D(y), Aa(R(y, 2), (e, t) => cl?.(e, t), () => t.app_id), D(v), D(h), so(h, (e) => n = e, () => n), Ma(h, () => Tu(() => [
		ou(({ offset: e, rootNode: t }) => {
			t.style.transform = `translate(${e.x}px,${e.y}px)`;
		}),
		l,
		lu(su.viewport({
			top: 40,
			left: 7,
			right: 7,
			bottom: 100
		})),
		d,
		u,
		du({
			onDragStart: p,
			onDragEnd: m
		})
	])), yr((e) => {
		J(h, "hidden", !$.open[t.app_id] || $.minimized[t.app_id]), h.inert = $.exiting[t.app_id], g = Ba(h, 1, "container mac-window s-4l7tac", null, g, {
			active: $.active === t.app_id,
			"is-focused": $.active === t.app_id,
			"is-maximized": V(r)
		}), J(h, "id", `mac-window-${t.app_id ?? ""}`), J(h, "aria-labelledby", `mac-title-${t.app_id ?? ""}`), _ = Ua(h, "", _, { "z-index": $.z_indices[t.app_id] }), J(x, "id", `mac-title-${t.app_id ?? ""}`), q(S, e);
	}, [() => Z(Uo[t.app_id].key)]), G("pointerdown", h, () => nl(t.app_id)), G("focusin", h, () => nl(t.app_id)), G("dblclick", y, (e) => {
		e.target.closest("button") || f();
	}), K(e, h), lt();
}
var Ju, Yu = t((() => {
	Do(), Y(), Du(), To(), Qc(), Lc(), Wo(), Oo(), fl(), Gu(), Ku(), Ju = /* @__PURE__ */ Ni("<div role=\"dialog\" tabindex=\"-1\"><div class=\"mac-window-visual s-4l7tac\"><header class=\"mac-titlebar app-window-drag-handle s-4l7tac\"><!> <span class=\"mac-window-title s-4l7tac\"> </span></header>  <div class=\"mac-window-body s-4l7tac\" tabindex=\"0\"></div></div></div>"), xi([
		"pointerdown",
		"focusin",
		"dblclick"
	]);
})), Xu = t((() => {}));
//#endregion
//#region src/components/Desktop/Window/WindowsArea.svelte
function Zu(e) {
	var t = Qu();
	oa(t, 5, () => Vo, ra, (e, t) => {
		qu(e, { get app_id() {
			return V(t).id;
		} });
	}), D(t), K(e, t);
}
var Qu, $u = t((() => {
	Do(), Vl(), Y(), Wo(), Yu(), Xu(), Qu = /* @__PURE__ */ Ni("<section id=\"windows-area\" class=\"mac-window-layer s-6m3pf8\" aria-label=\"Windows\"></section>");
})), ed, td = t((() => {
	ed = "\nfloat hash21(vec2 p) {\n p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);\n}\nfloat noise21(vec2 p) {\n vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);\n return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),f.x),mix(hash21(i+vec2(0.,1.)),hash21(i+vec2(1.,1.)),f.x),f.y);\n}\nfloat fractal(vec2 p) {\n float f=0.0,a=0.55;\n for(int i=0;i<3;i++){f+=a*noise21(p);p=mat2(1.6,-1.2,1.2,1.6)*p+13.7;a*=0.48;}\n return f;\n}\nvec3 stars(vec2 p,float time) {\n vec2 cell=floor(p*110.0),f=fract(p*110.0)-0.5;\n float seed=hash21(cell);\n float glow=pow(max(0.0,1.0-length(f)*2.0),7.0)*step(0.991,seed);\n return vec3(0.68,0.82,1.0)*glow*(0.7+0.3*sin(time+seed*70.0));\n}\nvec3 ocean(vec2 screen,float time,vec2 pointer,float relief) {\n vec3 ray=normalize(vec3(screen.x*0.8,screen.y*0.7-0.24+pointer.y*0.045,-1.5));\n vec3 sun=normalize(vec3(0.65+pointer.x*0.12,0.20,-1.5));\n float sunDot=max(dot(ray,sun),0.0);\n vec3 sky=mix(vec3(0.86,0.30,0.20),vec3(0.12,0.23,0.43),smoothstep(-0.08,0.8,ray.y));\n sky+=vec3(1.0,0.64,0.31)*pow(sunDot,240.0)*1.2;\n sky+=vec3(1.0,0.22,0.06)*pow(sunDot,16.0)*0.23;\n if(ray.y>=0.0)return sky;\n float distance=1.2/max(-ray.y,0.003);\n vec2 p=vec2(ray.x,ray.z)*distance;\n vec2 gradient=vec2(0.0);\n for(int i=0;i<4;i++){\n  float k=float(i),frequency=0.65+k*0.8;\n  vec2 direction=vec2(cos(k*1.17),sin(k*1.17));\n  gradient+=direction*cos(dot(p,direction)*frequency+time*(0.65+k*0.23))*0.12/(1.0+k*0.5);\n }\n gradient*=0.8+relief*0.35;\n vec3 n=normalize(vec3(-gradient.x,1.0,-gradient.y));\n vec3 reflection=reflect(ray,n);\n float fresnel=pow(1.0-max(dot(-ray,n),0.0),4.0);\n vec3 water=mix(vec3(0.008,0.12,0.19),vec3(0.06,0.36,0.40),clamp(n.y*0.6+gradient.x,0.,1.));\n water=mix(water,vec3(0.76,0.35,0.22),fresnel*0.8);\n float glitter=pow(max(dot(reflection,sun),0.0),110.0);\n water+=vec3(1.0,0.70,0.36)*glitter*1.5;\n water=mix(water,sky,1.0-exp(-distance*0.009));\n return water;\n}\nvec3 nebula(vec2 p,float time,vec2 pointer,float relief) {\n p=p*1.6+pointer*0.12;\n float t=time*0.055;\n vec2 warp=vec2(fractal(p+vec2(t,-t)),fractal(p+vec2(5.1,-2.3)-t));\n float density=fractal(p+(warp-0.5)*(3.0+relief)+vec2(t*0.5,0.0));\n float cloud=smoothstep(0.24,0.86,density);\n float filament=exp(-abs(density-0.56)*32.0);\n vec3 color=mix(vec3(0.008,0.015,0.06),vec3(0.24,0.13,0.49),cloud);\n color+=vec3(0.16,0.37,0.53)*filament*(0.25+warp.y);\n float ember=smoothstep(0.47,0.78,warp.x)*cloud;\n color=mix(color,vec3(0.90,0.39,0.22),ember*0.85);\n color+=vec3(0.8,0.60,0.80)*pow(cloud,4.0)*0.6;\n return color+stars(p*0.5,time*0.2);\n}\nvec3 ribbons(vec2 p,float time,vec2 pointer,float relief) {\n p+=pointer*0.13;float t=time*0.22;\n vec3 color=vec3(0.012,0.018,0.045);\n for(int i=0;i<6;i++) {\n  float k=float(i);\n  float curve=sin(p.x*0.95+t+k*0.42)*0.42 + sin(p.x*0.37-t*0.6)*0.45;\n  float d=p.y+p.x*0.32-curve+(k-2.5)*0.28;\n  float width=0.055+0.018*sin(p.x+k+t)+relief*0.015;\n  float body=exp(-pow(d/width,2.0));\n  float edge=exp(-pow((d-width*0.6)/(width*0.23),2.0));\n  vec3 tint=0.5+0.5*cos(vec3(0.0,2.1,4.2)+k*0.73+p.x*0.18);\n  color+=tint*exp(-abs(d)*7.0)*0.09;\n  color=mix(color,tint*(0.45+body*0.45)+edge*0.38,body*0.9);\n }\n return color;\n}\nvec3 warpTunnel(vec2 p,float time,vec2 pointer,float relief) {\n p-=vec2(0.58,0.05)+pointer*0.16;\n float r=max(length(p),0.02),angle=atan(p.y,p.x);\n float depth=-log(r),t=time*(0.28+relief*0.08);\n vec3 color=vec3(0.008,0.012,0.038);\n float twist=angle+depth*0.35+sin(time*0.12)*0.3;\n float ring=abs(fract(depth*2.6-t)-0.5);\n float filament=exp(-ring*65.0)*smoothstep(0.05,0.6,r);\n float spokes=pow(0.5+0.5*sin(twist*7.0+depth),12.0);\n vec3 tint=0.5+0.5*cos(vec3(0.4,2.2,4.1)+depth*0.6+angle*0.35);\n color+=tint*filament*(0.14+spokes*0.5);\n vec2 starUv=vec2((angle/6.283185+0.5)*95.0,depth*9.0-t*2.0);\n vec2 cell=floor(starUv),f=fract(starUv)-0.5;\n float seed=hash21(cell);\n float streak=exp(-abs(f.x)*60.0-abs(f.y)*5.0)*step(0.80,seed);\n color+=mix(vec3(0.28,0.65,1.0),vec3(0.9,0.66,0.9),seed)*streak*smoothstep(0.06,0.7,r);\n color+=vec3(0.06,0.12,0.28)*exp(-r*1.8);\n return color;\n}\n";
}));
//#endregion
//#region src/components/Desktop/wallpaper/folded-scene.ts
function nd(e) {
	let t = e.getContext("webgl", {
		alpha: !0,
		antialias: !0,
		depth: !0,
		powerPreference: "high-performance"
	});
	if (!t) return null;
	let n = [], r = (e, r) => {
		let i = t.createShader(e);
		if (n.push(i), t.shaderSource(i, r), t.compileShader(i), !t.getShaderParameter(i, t.COMPILE_STATUS)) throw Error(t.getShaderInfoLog(i) || "Wallpaper shader compilation failed");
		return i;
	}, i = t.createProgram(), a = t.createProgram();
	try {
		if (t.attachShader(i, r(t.VERTEX_SHADER, rd)), t.attachShader(i, r(t.FRAGMENT_SHADER, id)), t.linkProgram(i), !t.getProgramParameter(i, t.LINK_STATUS)) throw Error(t.getProgramInfoLog(i) || "Wallpaper shader linking failed");
		if (t.attachShader(a, r(t.VERTEX_SHADER, "attribute vec2 aUv;varying vec2 vUv;void main(){vUv=vec2(aUv.x,(aUv.y+1.0)*0.5);gl_Position=vec4(aUv.x*2.0-1.0,aUv.y,0.0,1.0);}")), t.attachShader(a, r(t.FRAGMENT_SHADER, "precision mediump float;uniform sampler2D uSnapshot;uniform float uOpacity;varying vec2 vUv;void main(){gl_FragColor=vec4(texture2D(uSnapshot,vUv).rgb,uOpacity);}")), t.linkProgram(a), !t.getProgramParameter(a, t.LINK_STATUS)) throw Error(t.getProgramInfoLog(a) || "Wallpaper blend linking failed");
	} catch (e) {
		return n.forEach((e) => t.deleteShader(e)), t.deleteProgram(i), t.deleteProgram(a), console.warn("3D wallpaper uses its static fallback:", e), null;
	}
	n.forEach((e) => t.deleteShader(e));
	let o = [], s = [];
	for (let e = 0; e <= 170; e++) for (let t = 0; t <= 170; t++) o.push(e / 170, t / 170 * 2 - 1);
	for (let e = 0; e < 170; e++) for (let t = 0; t < 170; t++) {
		let n = e * 171 + t, r = n + 170 + 1;
		s.push(n, r, n + 1, r, r + 1, n + 1);
	}
	let c = t.createBuffer(), l = t.createBuffer(), u = t.createBuffer(), d = t.createBuffer();
	t.bindBuffer(t.ARRAY_BUFFER, c), t.bufferData(t.ARRAY_BUFFER, new Float32Array(o), t.STATIC_DRAW), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, l), t.bufferData(t.ELEMENT_ARRAY_BUFFER, new Uint16Array(s), t.STATIC_DRAW), t.bindBuffer(t.ARRAY_BUFFER, u), t.bufferData(t.ARRAY_BUFFER, new Float32Array([
		0,
		-1,
		1,
		-1,
		0,
		1,
		1,
		1
	]), t.STATIC_DRAW), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, d), t.bufferData(t.ELEMENT_ARRAY_BUFFER, new Uint16Array([
		0,
		1,
		2,
		2,
		1,
		3
	]), t.STATIC_DRAW), t.bindBuffer(t.ARRAY_BUFFER, c), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, l), t.useProgram(i);
	let f = t.getAttribLocation(i, "aUv");
	t.enableVertexAttribArray(f), t.vertexAttribPointer(f, 2, t.FLOAT, !1, 0, 0);
	let p = Object.fromEntries([
		"uTime",
		"uAspect",
		"uOpen",
		"uPointer",
		"uMode"
	].map((e) => [e, t.getUniformLocation(i, e)])), m = t.getAttribLocation(a, "aUv"), h = t.getUniformLocation(a, "uOpacity"), g = t.getUniformLocation(a, "uSnapshot"), _ = t.createTexture();
	t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, _), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
	let v = -1, y = -Infinity, b = (e) => {
		let t = Math.min(1, Math.max(0, (e - y) / 1600));
		return 1 - t * t * (3 - 2 * t);
	};
	t.enable(t.DEPTH_TEST), t.clearColor(0, 0, 0, 0);
	let x = (n, r, a, o, m) => {
		t.useProgram(i), t.bindBuffer(t.ARRAY_BUFFER, m >= 3 ? u : c), t.enableVertexAttribArray(f), t.vertexAttribPointer(f, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, m >= 3 ? d : l), t.uniform1f(p.uMode, m), t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT), t.uniform1f(p.uTime, n), t.uniform1f(p.uAspect, e.width / e.height), t.uniform2f(p.uPointer, r, a), t.uniform1f(p.uOpen, o), t.drawElements(t.TRIANGLES, m >= 3 ? 6 : s.length, t.UNSIGNED_SHORT, 0);
	}, S = (e) => {
		e <= 0 || (t.useProgram(a), t.disable(t.DEPTH_TEST), t.enable(t.BLEND), t.blendFuncSeparate(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA, t.ZERO, t.ONE), t.bindBuffer(t.ARRAY_BUFFER, u), t.enableVertexAttribArray(m), t.vertexAttribPointer(m, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, d), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, _), t.uniform1i(g, 0), t.uniform1f(h, e), t.drawElements(t.TRIANGLES, 6, t.UNSIGNED_SHORT, 0), t.disable(t.BLEND), t.enable(t.DEPTH_TEST));
	};
	return {
		resize() {
			let n = Math.min(devicePixelRatio || 1, 1.5), r = Math.min(1, 1800 / (innerWidth * n), Math.sqrt(2e6 / (innerWidth * innerHeight * n * n)));
			e.width = Math.round(innerWidth * n * r), e.height = Math.round(innerHeight * n * r), t.viewport(0, 0, e.width, e.height), y = -Infinity;
		},
		draw(n, r, i, a, o, s = !0) {
			let c = performance.now();
			s || (y = -Infinity), o !== v && v >= 0 && s && (x(n, r, i, a, v), S(b(c)), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, _), t.copyTexImage2D(t.TEXTURE_2D, 0, t.RGB, 0, 0, e.width, e.height, 0), y = c), v = o, x(n, r, i, a, o), S(b(c));
		},
		dispose() {
			t.deleteBuffer(c), t.deleteBuffer(l), t.deleteBuffer(u), t.deleteBuffer(d), t.deleteTexture(_), t.deleteProgram(i), t.deleteProgram(a);
		}
	};
}
var rd, id, ad = t((() => {
	td(), rd = "\nprecision highp float;\nattribute vec2 aUv;\nuniform float uTime, uAspect, uOpen, uMode;\nuniform vec2 uPointer;\nvarying vec3 vNormal, vPosition;\nvarying vec2 vUv;\nvec3 surface(vec2 uv) {\n float x = (uv.x * 15.0 - 7.5) * max(1.0, uAspect / 1.8);\n float y = uv.y * 5.5;\n float t = uTime * 0.12;\n float bend = y + x * 0.48 + sin(x * 0.51 + t) * 0.95;\n float wave = sin(bend * 1.65 + t);\n float ridge = pow(0.5 + wave * 0.5, 2.4);\n float z = ridge * (1.25 + uOpen * 0.35) + sin(x * 0.45 - y * 0.4 + t) * 0.42;\n z += sin(bend * 3.3 + t * 2.0) * 0.07;\n if(uMode > 0.5 && uMode < 1.5) {\n  float r = length(vec2((x - uAspect * 1.1) * 0.75, (y + 0.85) * 1.15));\n  z = sin(r * 2.0 - t * 1.8 + sin(x * 0.6 + t) * 0.7) * (0.55 + uOpen * 0.22);\n  z += cos(x * 0.65 + y * 0.8 + t) * 0.35;\n } else if(uMode > 1.5 && uMode < 2.5) {\n  float dune = y * 1.45 + sin(x * 0.33 + t * 0.5) * 1.8 + x * 0.18;\n  z = pow(0.5 + sin(dune) * 0.5, 3.8) * (1.3 + uOpen * 0.25);\n  z += sin(x * 0.3 - y * 0.2) * 0.24;\n } else if(uMode > 2.5) { z = 0.0; }\n return vec3(x + uPointer.x * 0.13, y + uPointer.y * 0.10, z);\n}\nvoid main() {\n if(uMode > 2.5) {\n  vPosition=vec3((aUv.x*2.0-1.0)*3.0*uAspect,aUv.y*3.0,0.0);\n  vNormal=vec3(0.0,0.0,1.0);vUv=aUv;\n  gl_Position=vec4(aUv.x*2.0-1.0,aUv.y,0.0,1.0);return;\n }\n vec3 p = surface(aUv);\n vec3 du = surface(aUv + vec2(0.0005,0.0)) - p;\n vec3 dv = surface(aUv + vec2(0.0,0.0005)) - p;\n vNormal = normalize(cross(du,dv)); vPosition = p; vUv = aUv;\n float depth = 6.0 - p.z;\n gl_Position = vec4(p.x / uAspect * 2.0, p.y * 2.0, (depth-3.0)*0.2, depth);\n}", id = `
precision highp float;
uniform vec2 uPointer;
uniform float uMode, uTime, uAspect, uOpen;
varying vec3 vNormal, vPosition;
varying vec2 vUv;
${ed}
void main() {
 vec2 screen=vec2((vUv.x*2.0-1.0)*uAspect,vUv.y);
 if(uMode > 3.5) {
  vec3 color;
  if(uMode < 4.5)color=ocean(screen,uTime,uPointer,uOpen);
  else if(uMode < 5.5)color=nebula(screen,uTime,uPointer,uOpen);
  else if(uMode < 6.5)color=ribbons(screen,uTime,uPointer,uOpen);
  else color=warpTunnel(screen,uTime,uPointer,uOpen);
  gl_FragColor=vec4(color,1.0);return;
 }
 if(uMode > 2.5) {
  vec2 q = vec2(vPosition.x * 0.27, vPosition.y * 0.23);
  float t = uTime * 0.10;
  q += uPointer * vec2(0.08,0.05);
  vec3 sky = mix(vec3(0.008,0.018,0.055),vec3(0.025,0.10,0.17),smoothstep(-1.0,1.0,q.y));
  vec3 glow = vec3(0.0);
  for(int i=0;i<4;i++) {
   float k=float(i);
   float arc = sin(q.x * (1.3+k*0.16) + t + k*0.55) * 0.42 + k*0.15 - 0.18;
   arc += sin(q.x * 2.6 - t * 0.6) * 0.1;
   float d=q.y-arc;
   float curtain = exp(-abs(d)*(d>0.0?3.5:24.0));
   float rays = 0.65+0.35*sin(q.x*38.0+sin(q.x*8.0+t)*3.0+k);
   vec3 tint = mix(vec3(0.045,0.8,0.48),vec3(0.34,0.17,0.70),k/3.0);
   glow += tint * curtain * rays * (0.24 + uOpen*0.1);
  }
  vec2 starCell=floor(q*125.0);
  float hash=fract(sin(dot(starCell,vec2(127.1,311.7)))*43758.5453);
  float star=step(0.997,hash)*pow(max(0.0,1.0-length(fract(q*125.0)-0.5)*2.0),5.0);
  gl_FragColor=vec4(sky+glow+star*0.55,1.0);return;
 }
 vec3 n = normalize(vNormal);
 vec3 light = normalize(vec3(-0.4 + uPointer.x * 0.25,1.0,1.2));
 vec3 view = normalize(vec3(0.0,0.0,6.0)-vPosition);
 float diffuse = max(dot(n,light),0.0);
 float spec = pow(max(dot(n,normalize(light+view)),0.0),38.0);
 float broad = pow(max(dot(n,normalize(light+view)),0.0),5.0);
 float band = sin(vPosition.y * 0.45 + vPosition.x * 0.18 + 0.5) * 0.5 + 0.5;
 vec3 violet = vec3(0.30,0.055,0.75);
 vec3 blue = vec3(0.015,0.17,0.82);
 vec3 color = mix(blue,violet,smoothstep(0.2,0.9,band));
 float coral = smoothstep(0.32,0.9,vUv.x) * smoothstep(-0.3,2.4,vPosition.y);
 color = mix(color,vec3(1.0,0.19,0.25),coral*0.88);
 if(uMode > 0.5 && uMode < 1.5) {
  color = mix(vec3(0.018,0.12,0.15),vec3(0.58,0.78,0.77),broad);
  color += vec3(0.04,0.13,0.17) * sin(vPosition.x * 0.6 + vPosition.y);
 } else if(uMode > 1.5) {
  color = mix(vec3(0.22,0.035,0.045),vec3(0.9,0.36,0.12),diffuse);
  color = mix(color,vec3(0.95,0.65,0.32),smoothstep(0.8,1.0,diffuse)*0.6);
 }
 color *= 0.22 + diffuse * 0.88;
 color += broad * vec3(0.13,0.16,0.38) * 0.55;
 vec3 highlight = uMode < 0.5 ? mix(vec3(0.30,0.63,1.0),vec3(1.0,0.74,0.66),coral) : (uMode < 1.5 ? vec3(0.80,0.95,0.94) : vec3(1.0,0.67,0.36));
 color += spec * highlight * (uMode > 1.5 ? 0.12 : 0.82);
 float fresnel = pow(1.0-max(dot(n,view),0.0),3.0);
 color += fresnel * (uMode > 1.5 ? vec3(0.15,0.055,0.025) : vec3(0.15,0.22,0.35));
 color = pow(color,vec3(0.92));
 gl_FragColor = vec4(color,1.0);
}`;
})), od = t((() => {}));
//#endregion
//#region src/components/Desktop/LiveWallpaper.svelte
function sd(e, t) {
	ct(t, !0);
	let n, r = /* @__PURE__ */ Qt(() => Ml.find((e) => e.id === Pl.current));
	dr(() => {
		Pl.current, n?.();
	});
	let i, a = /* @__PURE__ */ jn(!1);
	So(() => {
		let e = nd(i);
		if (!e) return;
		let t = matchMedia("(prefers-reduced-motion: reduce)"), r = 0, o = 0, s = 0, c = 0, l = 0, u = 0, d = 0, f = 0, p = 1, m = 1, h = !1, g = !1, _ = (n) => {
			if (r = 0, !(h || document.hidden || g)) {
				if (n + .5 >= s || t.matches) {
					let r = Math.min(Math.max(0, (n - o) / 1e3), .08);
					if (o = n, s = Math.max(s + 1e3 / 60, n), !t.matches) {
						c += r;
						let e = 1 - Math.exp(-2.34 * r);
						l += (d - l) * e, u += (f - u) * e, p += (m - p) * (1 - Math.exp(-1.38 * r));
					}
					e?.draw(c, l, u, p, Ml.findIndex((e) => e.id === Pl.current), !t.matches), F(a, !0);
				}
				t.matches || (r = requestAnimationFrame(_));
			}
		}, v = () => {
			cancelAnimationFrame(r), o = performance.now(), s = 0, !document.hidden && !g && (r = requestAnimationFrame(_));
		};
		n = v;
		let y = () => {
			e?.resize(), v();
		}, b = (e) => {
			e.pointerType === "touch" || t.matches || (d = e.clientX / innerWidth * 2 - 1, f = 1 - e.clientY / innerHeight * 2);
		}, x = () => {
			d = 0, f = 0;
		}, S = (e) => {
			if (t.matches) return;
			let n = e.target;
			n.closest("button,a,input,summary,nav,header,.mac-window") || n.closest(".mac-desktop") && (m = m === 1 ? 0 : 1);
		}, C = (e) => {
			e.preventDefault(), g = !0, cancelAnimationFrame(r), F(a, !1);
		}, w = () => {
			g = !1, e?.dispose(), e = nd(i), e && y();
		};
		return window.addEventListener("pointermove", b, { passive: !0 }), document.documentElement.addEventListener("pointerleave", x), window.addEventListener("click", S), window.addEventListener("resize", y), document.addEventListener("visibilitychange", v), t.addEventListener("change", v), i.addEventListener("webglcontextlost", C), i.addEventListener("webglcontextrestored", w), y(), () => {
			n = void 0, h = !0, cancelAnimationFrame(r), e?.dispose(), window.removeEventListener("pointermove", b), document.documentElement.removeEventListener("pointerleave", x), window.removeEventListener("click", S), window.removeEventListener("resize", y), document.removeEventListener("visibilitychange", v), t.removeEventListener("change", v), i.removeEventListener("webglcontextlost", C), i.removeEventListener("webglcontextrestored", w);
		};
	});
	var o = cd(), s = L(o);
	let c;
	var l = R(s, 2);
	let u;
	so(l, (e) => i = e, () => i), qe(2), D(o), yr(() => {
		J(o, "data-wallpaper", Pl.current), Ua(o, `--fallback-base:${V(r).colors[0]};--fallback-mid:${V(r).colors[1]};--fallback-light:${V(r).colors[2]}`), c = Ba(s, 0, "wallpaper-fallback s-fa2i1z", null, c, { concealed: V(a) }), u = Ba(l, 1, "s-fa2i1z", null, u, { visible: V(a) });
	}), K(e, o), lt();
}
var cd, ld = t((() => {
	Do(), Y(), Fl(), To(), ad(), od(), cd = /* @__PURE__ */ Ni("<div class=\"live-wallpaper s-fa2i1z\" aria-hidden=\"true\"><svg viewBox=\"0 0 1600 1000\" preserveAspectRatio=\"xMidYMid slice\"><defs><linearGradient id=\"fold-base\" x2=\"1\" y2=\"1\"><stop stop-color=\"#171444\"></stop><stop offset=\".5\" stop-color=\"#3031b2\"></stop><stop offset=\"1\" stop-color=\"#7b32c2\"></stop></linearGradient><linearGradient id=\"fold-ribbon\" x1=\"0\" y1=\"1\" x2=\"1\" y2=\"0\"><stop stop-color=\"#08143b\"></stop><stop offset=\".43\" stop-color=\"#233cb9\"></stop><stop offset=\".67\" stop-color=\"#8984f4\"></stop><stop offset=\".72\" stop-color=\"#b1b7ff\"></stop><stop offset=\".79\" stop-color=\"#6032b7\"></stop><stop offset=\"1\" stop-color=\"#24123e\"></stop></linearGradient></defs><path fill=\"url(#fold-base)\" d=\"M0 0h1600v1000H0z\"></path><g fill=\"url(#fold-ribbon)\"><path d=\"M-400 -400C600 -300 380 600 1900 700L1900 1200C650 1000 300 100 -400 200Z\"></path><path d=\"M-400 200C450 100 500 1000 1900 1100L1900 1500C400 1300 200 650 -400 800Z\"></path><path d=\"M-200 -700C1100 -400 800 200 1800 300L1900 700C800 600 400 -200 -200 -100Z\"></path></g></svg> <canvas></canvas> <div class=\"wallpaper-shade s-fa2i1z\"></div></div>");
})), ud = t((() => {})), dd = /* @__PURE__ */ n({ default: () => fd });
function fd(e, t) {
	ct(t, !0);
	let n = /* @__PURE__ */ jn("");
	function r() {
		F(n, new Intl.DateTimeFormat(X.locale, {
			month: "short",
			day: "numeric",
			weekday: "short",
			hour: "2-digit",
			minute: "2-digit",
			hour12: !1
		}).format(/* @__PURE__ */ new Date()), !0);
	}
	function i(e) {
		window.PortfolioI18n.applyLocale(e);
	}
	So(() => {
		let e = () => {
			X.locale = document.documentElement.lang, document.querySelectorAll("[data-desktop-text]").forEach((e) => e.textContent = Z(e.dataset.desktopText)), r();
		}, t = matchMedia("(prefers-reduced-motion: reduce)"), n = () => {
			X.reduced = t.matches, X.reduced && Hc();
		}, i = () => X.compact = innerWidth <= 720, a = (e) => {
			e.key === "Escape" && $.active && !document.fullscreenElement && (e.preventDefault(), al($.active));
		}, o = (e) => {
			let t = e.target, n = t.closest(".mac-project-launcher");
			if (n) {
				e.preventDefault(), rl(n.dataset.appOpen);
				return;
			}
			let r = t.closest("a[href^=\"#\"]");
			if (!r) return;
			let i = r.getAttribute("href").slice(1);
			if (i === "top") {
				e.preventDefault(), ol();
				return;
			}
			if (i === "main-content") {
				e.preventDefault(), rl("projects");
				return;
			}
			let a = Vo.find((e) => e.hash === i || document.getElementById(i)?.closest(`#mac-window-${e.id}`));
			a && (e.preventDefault(), rl(a.id));
		};
		document.addEventListener("portfolio:localechange", e), document.addEventListener("click", o), document.addEventListener("keydown", a), window.addEventListener("popstate", sl), window.addEventListener("hashchange", sl), window.addEventListener("resize", i), t.addEventListener("change", n);
		let s = setInterval(r, 3e4);
		return r(), document.documentElement.classList.add("desktop-ready"), document.body.classList.add("has-desktop"), document.querySelectorAll(".is-pending").forEach((e) => e.classList.remove("is-pending")), sl(), () => {
			clearInterval(s), document.removeEventListener("portfolio:localechange", e), document.removeEventListener("click", o), document.removeEventListener("keydown", a), window.removeEventListener("popstate", sl), window.removeEventListener("hashchange", sl), window.removeEventListener("resize", i), t.removeEventListener("change", n);
		};
	});
	var a = md(), o = L(a);
	sd(o, {});
	var s = R(o, 2), c = L(s), l = L(c), u = R(l), d = R(u), f = L(d, !0);
	D(d);
	var p = R(d), m = L(p, !0);
	D(p);
	var h = R(p), g = L(h, !0);
	D(h), D(c);
	var _ = R(c, 2), v = L(_);
	Ll(v, {});
	var y = R(v);
	Cl(y, {});
	var b = R(y), x = L(b), S = R(x);
	D(b);
	var C = R(b), w = L(C, !0);
	D(C), D(_), D(s);
	var ee = R(s, 2), te = L(ee), ne = L(te, !0);
	D(te);
	var re = R(te), ie = L(re, !0);
	D(re);
	var ae = R(re), oe = L(ae, !0);
	D(ae);
	var se = R(ae), ce = L(se, !0);
	D(se);
	var le = R(se), ue = L(le), de = L(ue, !0);
	D(ue), qe(), D(le), D(ee);
	var fe = R(ee, 2);
	oa(fe, 20, () => [
		{
			id: "about",
			label: "file"
		},
		{
			id: "projects",
			label: "folder"
		},
		{
			id: "contact",
			label: "note"
		}
	], ra, (e, t) => {
		var n = pd(), r = L(n);
		ma(r, () => Io[t.id], !0), D(r);
		var i = R(r), a = L(i, !0);
		D(i), D(n), yr((e) => q(a, e), [() => Z(t.label)]), G("click", n, () => rl(t.id)), K(e, n);
	}), D(fe);
	var pe = R(fe, 2), me = R(L(pe)), he = L(me, !0);
	D(me), D(pe);
	var ge = R(pe, 2);
	Zu(ge, {}), vl(R(ge, 2), {}), D(a), yr((e, t, r, i, a, o, s, c, u, d, p) => {
		J(l, "aria-label", e), q(f, t), q(m, r), q(g, i), J(x, "aria-pressed", X.locale === "zh-CN"), J(S, "aria-pressed", X.locale === "en"), q(w, V(n)), q(ne, a), q(ie, o), q(oe, s), q(ce, c), q(de, u), J(fe, "aria-label", d), q(he, p);
	}, [
		() => Z("home"),
		() => $.active ? Z($.active) : Z("desktop"),
		() => Z("projects"),
		() => Z("contact"),
		() => Z("role"),
		() => Z("greeting"),
		() => Z("headline"),
		() => Z("subtitle"),
		() => Z("explore"),
		() => Z("navigation"),
		() => Z("made")
	]), G("click", l, () => ol()), G("click", u, () => rl("about")), G("click", p, () => rl("projects")), G("click", h, () => rl("contact")), G("click", x, () => i("zh-CN")), G("click", S, () => i("en")), G("click", le, () => rl("projects")), K(e, a), lt();
}
var pd, md, hd = t((() => {
	Do(), Y(), To(), Sl(), kl(), Bl(), $u(), ld(), Wo(), Qc(), Oo(), Lc(), fl(), ud(), pd = /* @__PURE__ */ Ni("<button class=\"mac-shortcut\"><span class=\"mac-file-icon\"></span><span> </span></button>"), md = /* @__PURE__ */ Ni("<div class=\"container mac-desktop s-10nxqs3\"><!> <header class=\"mac-menubar\"><div class=\"mac-menu-left\"><button class=\"mac-home\" data-desktop-home=\"\"><img src=\"./assets/images/cat-logo.svg\" width=\"22\" height=\"22\" alt=\"\"/></button><button class=\"mac-brand\">Jason Chen</button><span class=\"mac-current-app\"> </span><button class=\"mac-menu-link\"> </button><button class=\"mac-menu-link\"> </button></div> <div class=\"mac-menu-right\"><!><!><div class=\"mac-locales\" aria-label=\"语言 / Language\"><button data-desktop-locale=\"zh-CN\">中</button><button data-desktop-locale=\"en\">EN</button></div><time class=\"mac-clock\"> </time></div></header> <div class=\"mac-desktop-intro\"><p class=\"mac-overline\"> </p><p class=\"mac-greeting\"> </p><p class=\"mac-headline\"> </p><p class=\"mac-description\"> </p><button class=\"mac-explore\"><span> </span><span aria-hidden=\"true\">↗</span></button></div> <nav class=\"mac-shortcuts\"></nav> <p class=\"mac-desktop-signature\">JASON’S WORKSPACE<span> </span></p> <!> <!></div>"), xi(["click"]);
}));
To(), document.readyState === "loading" && await new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
var { default: gd } = await Promise.resolve().then(() => (hd(), dd)), _d = document.createElement("div");
_d.id = "macos-root", document.body.append(_d), Ri(gd, { target: _d });
//#endregion
