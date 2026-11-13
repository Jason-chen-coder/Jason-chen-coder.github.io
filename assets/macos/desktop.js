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
	return typeof e == "function";
}
function s(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function c() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var l, u, d, f, p, m, h, g, _, v, y, b, x = t((() => {
	l = Array.isArray, u = Array.prototype.indexOf, d = Array.prototype.includes, f = Array.from, p = Object.defineProperty, m = Object.getOwnPropertyDescriptor, h = Object.getOwnPropertyDescriptors, g = Object.prototype, _ = Array.prototype, v = Object.getPrototypeOf, y = Object.isExtensible, b = () => {};
})), S, C, w, ee, te, ne, re, ie, ae, oe, se, ce, le, ue, de, fe, pe, me, he, ge, _e, ve, ye, be, xe, T = t((() => {
	S = 1 << 24, C = 1024, w = 2048, ee = 4096, te = 8192, ne = 16384, re = 32768, ie = 1 << 25, ae = 65536, oe = 1 << 19, se = 1 << 20, ce = 1 << 25, le = 65536, ue = 1 << 21, de = 1 << 22, fe = 1 << 23, pe = Symbol("$state"), me = Symbol("legacy props"), he = Symbol(""), ge = Symbol("attributes"), _e = Symbol("class"), ve = Symbol("style"), ye = Symbol("text"), be = new class extends Error {
		name = "StaleReactionError";
		message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
	}(), xe = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml");
}));
function Se(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
var Ce = t((() => {
	a();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function we() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Te(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function Ee(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function De() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Oe(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function ke() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ae(e) {
	throw Error("https://svelte.dev/e/props_invalid_value");
}
function je() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Me() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ne() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Pe() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
var Fe = t((() => {
	a(), Ce();
})), Ie, E, Le, Re, ze, Be = t((() => {
	Ie = {}, E = Symbol("uninitialized"), Le = "http://www.w3.org/1999/xhtml", Re = "http://www.w3.org/2000/svg", ze = "http://www.w3.org/1998/Math/MathML";
}));
function Ve() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function He(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Ue() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
var We = t((() => {
	a();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
function Ge(e) {
	O = e;
}
function Ke(e) {
	if (e === null) throw He(), Ie;
	return k = e;
}
function qe() {
	return Ke(/* @__PURE__ */ Kn(k));
}
function D(e) {
	if (O) {
		if (/* @__PURE__ */ Kn(k) !== null) throw He(), Ie;
		k = e;
	}
}
function Je(e = 1) {
	if (O) {
		for (var t = e, n = k; t--;) n = /* @__PURE__ */ Kn(n);
		k = n;
	}
}
function Ye(e = !0) {
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
function Xe(e) {
	if (!e || e.nodeType !== 8) throw He(), Ie;
	return e.data;
}
var O, k, A = t((() => {
	T(), Be(), We(), rr(), O = !1;
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Ze(e) {
	return e === this.v;
}
function Qe(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function $e(e) {
	return !Qe(e, this.v);
}
var et = t((() => {}));
//#endregion
//#region node_modules/svelte/src/internal/flags/index.js
function tt() {
	rt = !0;
}
var nt, rt, it = t((() => {
	nt = !1, rt = !1;
})), at = t((() => {
	x();
})), ot = t((() => {
	at(), T(), B(), W();
})), st = t((() => {
	a(), x(), Ce();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
function ct(e) {
	j = e;
}
function lt(e, t = !1, n) {
	j = {
		p: j,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: U,
		l: rt && !t ? {
			s: null,
			u: null,
			$: []
		} : null
	};
}
function ut(e) {
	var t = j, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) pr(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, j = t.p, e ?? {};
}
function dt() {
	return !rt || j !== null && j.l === null;
}
var j, M = t((() => {
	a(), Fe(), W(), B(), it(), T(), j = null;
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
function ft() {
	var e = ht;
	ht = [], s(e);
}
function pt(e) {
	if (ht.length === 0 && !Sn) {
		var t = ht;
		queueMicrotask(() => {
			t === ht && ft();
		});
	}
	ht.push(e);
}
function mt() {
	for (; ht.length > 0;) ft();
}
var ht, gt = t((() => {
	x(), An(), ht = [];
}));
//#endregion
//#region node_modules/svelte/src/internal/client/error-handling.js
function _t(e) {
	var t = U;
	if (t === null) return H.f |= fe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	vt(e, t);
}
function vt(e, t) {
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
var yt = t((() => {
	a(), Be(), rr(), T(), x(), W();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
function N(e, t) {
	e.f = e.f & xt | t;
}
function bt(e) {
	e.f & 512 || e.deps === null ? N(e, C) : N(e, ee);
}
var xt, St = t((() => {
	T(), xt = ~(w | ee | C);
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function Ct(e) {
	if (e !== null) for (let t of e) !(t.f & 2) || !(t.f & 65536) || (t.f ^= le, Ct(t.deps));
}
function wt(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), Ct(e.deps), N(e, C);
}
var Tt = t((() => {
	T(), St();
}));
//#endregion
//#region node_modules/svelte/src/store/utils.js
function Et(e, t, n) {
	if (e == null) return t(void 0), n && n(void 0), b;
	let r = $r(() => e.subscribe(t, n));
	return r.unsubscribe ? () => r.unsubscribe() : r;
}
var Dt = t((() => {
	W(), x();
}));
//#endregion
//#region node_modules/svelte/src/store/shared/index.js
function Ot(e, t = b) {
	let n = null, r = /* @__PURE__ */ new Set();
	function i(t) {
		if (Qe(e, t) && (e = t, n)) {
			let t = !At.length;
			for (let t of r) t[1](), At.push(t, e);
			if (t) {
				for (let e = 0; e < At.length; e += 2) At[e][0](At[e + 1]);
				At.length = 0;
			}
		}
	}
	function a(t) {
		i(t(e));
	}
	function o(o, s = b) {
		let c = [o, s];
		return r.add(c), r.size === 1 && (n = t(i, a) || b), o(e), () => {
			r.delete(c), r.size === 0 && n && (n(), n = null);
		};
	}
	return {
		set: i,
		update: a,
		subscribe: o
	};
}
function kt(e) {
	let t;
	return Et(e, (e) => t = e)(), t;
}
var At, jt = t((() => {
	x(), et(), Dt(), At = [];
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/store.js
function Mt(e, t, n) {
	let r = n[t] ??= {
		store: null,
		source: /* @__PURE__ */ Mn(void 0),
		unsubscribe: b
	};
	if (r.store !== e && !(Lt in n)) if (r.unsubscribe(), r.store = e ?? null, e == null) r.source.v = void 0, r.unsubscribe = b;
	else {
		var i = !0;
		r.unsubscribe = Et(e, (e) => {
			i ? r.source.v = e : I(r.source, e);
		}), i = !1;
	}
	return e && Lt in n ? kt(e) : V(r.source);
}
function Nt() {
	let e = {};
	function t() {
		dr(() => {
			for (var t in e) e[t].unsubscribe();
			p(e, Lt, {
				enumerable: !1,
				value: !0
			});
		});
	}
	return [e, t];
}
function Pt(e) {
	var t = It;
	try {
		return It = !1, [e(), It];
	} finally {
		It = t;
	}
}
var Ft, It, Lt, Rt = t((() => {
	Dt(), jt(), x(), W(), B(), L(), a(), Ft = !1, It = !1, Lt = Symbol("unmounted");
})), zt = t((() => {
	T(), at(), W();
}));
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function Bt(e) {
	let t = 0, n = jn(0), r;
	return () => {
		ur() && (V(n), yr(() => (t === 0 && (r = $r(() => e(() => Fn(n)))), t += 1, () => {
			pt(() => {
				--t, t === 0 && (r?.(), r = void 0, Fn(n));
			});
		})));
	};
}
var Vt = t((() => {
	W(), B(), L(), ot(), a(), gt();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
function Ht(e, t, n, r) {
	new Wt(e, t, n, r);
}
var Ut, Wt, Gt = t((() => {
	T(), Be(), M(), yt(), B(), W(), A(), gt(), Fe(), We(), a(), An(), L(), ot(), Vt(), rr(), Tt(), Ut = ae | oe, Wt = class {
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
		#h = Bt(() => (this.#m = jn(this.#l), () => {
			this.#m = null;
		}));
		constructor(e, t, n, r) {
			this.#e = e, this.#n = t, this.#r = (e) => {
				var t = U;
				t.b = this, t.f |= 128, n(e);
			}, this.parent = U.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = xr(() => {
				if (O) {
					let e = this.#t;
					qe();
					let t = e.data === "[!";
					if (e.data.startsWith("[?")) {
						let t = JSON.parse(e.data.slice(2));
						this.#_(t);
					} else t ? this.#v() : this.#g();
				} else this.#y();
			}, Ut), O && (this.#e = k);
		}
		#g() {
			try {
				this.#a = Cr(() => this.#r(this.#e));
			} catch (e) {
				this.error(e);
			}
		}
		#_(e) {
			let t = this.#n.failed;
			t && (this.#s = Cr(() => {
				t(this.#e, () => e, () => () => {});
			}));
		}
		#v() {
			let e = this.#n.pending;
			e && (this.is_pending = !0, this.#o = Cr(() => e(this.#e)), pt(() => {
				var e = this.#c = document.createDocumentFragment(), t = Wn();
				e.append(t), this.#a = this.#x(() => Cr(() => this.#r(t))), this.#u === 0 && (this.#e.before(e), this.#c = null, Ar(this.#o, () => {
					this.#o = null;
				}), this.#b(P));
			}));
		}
		#y() {
			try {
				if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = Cr(() => {
					this.#r(this.#e);
				}), this.#u > 0) {
					var e = this.#c = document.createDocumentFragment();
					Pr(this.#a, e);
					let t = this.#n.pending;
					this.#o = Cr(() => t(this.#e));
				} else this.#b(P);
			} catch (e) {
				this.error(e);
			}
		}
		#b(e) {
			this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
		}
		defer_effect(e) {
			wt(e, this.#f, this.#p);
		}
		is_rendered() {
			return !this.is_pending && (!this.parent || this.parent.is_rendered());
		}
		has_pending_snippet() {
			return !!this.#n.pending;
		}
		#x(e) {
			var t = U, n = H, r = j;
			zr(this.#i), Rr(this.#i), ct(this.#i.ctx);
			try {
				return On.ensure(), e();
			} catch (e) {
				return _t(e), null;
			} finally {
				zr(t), Rr(n), ct(r);
			}
		}
		#S(e, t) {
			if (!this.has_pending_snippet()) {
				this.parent && this.parent.#S(e, t);
				return;
			}
			this.#u += e, this.#u === 0 && (this.#b(t), this.#o && Ar(this.#o, () => {
				this.#o = null;
			}), this.#c &&= (this.#e.before(this.#c), null));
		}
		update_pending_count(e, t) {
			this.#S(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, pt(() => {
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
			this.#a &&= (Dr(this.#a), null), this.#o &&= (Dr(this.#o), null), this.#s &&= (Dr(this.#s), null), O && (Ke(this.#t), Je(), Ke(Ye()));
			var t = this.#n.onerror;
			let n = this.#n.failed;
			var r = !1, i = !1;
			let a = () => {
				if (r) {
					Ue();
					return;
				}
				r = !0, i && Pe(), this.#s !== null && Ar(this.#s, () => {
					this.#s = null;
				}), this.#x(() => {
					this.#y();
				});
			}, o = (e) => {
				try {
					i = !0, t?.(e, a), i = !1;
				} catch (e) {
					vt(e, this.#i && this.#i.parent);
				}
				n && (this.#s = this.#x(() => {
					try {
						return Cr(() => {
							var t = U;
							t.b = this, t.f |= 128, n(this.#e, () => e, () => a);
						});
					} catch (e) {
						return vt(e, this.#i.parent), null;
					}
				}));
			};
			pt(() => {
				var t;
				try {
					t = this.transform_error(e);
				} catch (e) {
					vt(e, this.#i && this.#i.parent);
					return;
				}
				typeof t == "object" && t && typeof t.then == "function" ? t.then(o, (e) => vt(e, this.#i && this.#i.parent)) : o(t);
			});
		}
	};
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function Kt(e, t, n, r) {
	let i = dt() ? Zt : en;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = U, c = qt(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				vt(e, s);
			}
			Jt();
		}
	}
	var d = Yt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ Qt(e))).then(u).catch((e) => vt(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), Jt();
	}) : f();
}
function qt() {
	var e = U, t = H, n = j, r = P;
	return function(i = !0) {
		zr(e), Rr(t), ct(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function Jt(e = !0) {
	zr(null), Rr(null), ct(null), e && P?.deactivate();
}
function Yt() {
	var e = U, t = e.b, n = P, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
var Xt = t((() => {
	T(), a(), M(), Gt(), yt(), W(), An(), cn(), B(), gt();
}));
/*#__NO_SIDE_EFFECTS__*/
function Zt(e) {
	var t = 2 | w;
	return U !== null && (U.f |= oe), {
		ctx: j,
		deps: null,
		effects: null,
		equals: Ze,
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
function Qt(e, t, n) {
	let r = U;
	r === null && we();
	var i = void 0, a = jn(E), o = !H, s = /* @__PURE__ */ new Set();
	return vr(() => {
		var t = U, n = c();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== be && n.reject(e);
			}).finally(Jt);
		} catch (e) {
			n.reject(e), Jt();
		}
		var l = P;
		if (o) {
			if (t.f & 32768) var u = Yt();
			if (r.b?.is_rendered()) l.async_deriveds.get(t)?.reject(sn);
			else for (let e of s.values()) e.reject(sn);
			s.add(n), l.async_deriveds.set(t, n);
		}
		let d = (e, t = void 0) => {
			u?.(), s.delete(n), t !== sn && (l.activate(), t ? (a.f |= fe, Nn(a, t)) : (a.f & 8388608 && (a.f ^= fe), Nn(a, e)), l.deactivate());
		};
		n.promise.then(d, (e) => d(null, e || "unknown"));
	}), dr(() => {
		for (let e of s) e.reject(sn);
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
function $t(e) {
	let t = /* @__PURE__ */ Zt(e);
	return nt || Br(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function en(e) {
	let t = /* @__PURE__ */ Zt(e);
	return t.equals = $e, t;
}
function tn(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) Dr(t[n]);
	}
}
function nn(e) {
	var t, n = U, r = e.parent;
	if (!ri && r !== null && e.v !== E && r.f & 24576) return Ve(), e.v;
	zr(r);
	try {
		e.f &= ~le, tn(e), t = Kr(e);
	} finally {
		zr(n);
	}
	return t;
}
function rn(e) {
	var t = nn(e);
	if (!e.equals(t) && (e.wv = Ur(), (!P?.is_fork || e.deps === null) && (P === null ? e.v = t : (P.capture(e, t, !0), yn?.capture(e, t, !0)), e.deps === null))) {
		N(e, C);
		return;
	}
	ri || (bn === null ? bt(e) : (ur() || P?.is_fork) && bn.set(e, t));
}
function an(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac?.abort(be), t.fn !== null && (t.teardown = b), t.ac = null, Jr(t, 0), Tr(t));
}
function on(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Yr(t);
}
var sn, cn = t((() => {
	a(), T(), W(), et(), Fe(), We(), B(), L(), st(), it(), M(), Be(), An(), Xt(), x(), St(), sn = Symbol("obsolete");
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
function ln(e) {
	var t = Sn;
	Sn = !0;
	try {
		var n;
		for (e && (P !== null && !P.is_fork && P.flush(), n = e());;) {
			if (mt(), P === null) return n;
			P.flush();
		}
	} finally {
		Sn = t;
	}
}
function un() {
	try {
		ke();
	} catch (e) {
		vt(e, xn);
	}
}
function dn(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Wr(r) && (kn = /* @__PURE__ */ new Set(), Yr(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && kr(r), kn?.size > 0)) {
				Rn.clear();
				for (let e of kn) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) kn.has(n) && (kn.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Yr(n);
					}
				}
				kn.clear();
			}
		}
		kn = null;
	}
}
function fn(e, t, n, r) {
	if (!n.has(e) && (n.add(e), e.reactions !== null)) for (let i of e.reactions) {
		let e = i.f;
		e & 2 ? fn(i, t, n, r) : e & 4194320 && !(e & 2048) && pn(i, t, r) && (N(i, w), mn(i));
	}
}
function pn(e, t, n) {
	let r = n.get(e);
	if (r !== void 0) return r;
	if (e.deps !== null) for (let r of e.deps) {
		if (d.call(t, r)) return !0;
		if (r.f & 2 && pn(r, t, n)) return n.set(r, !0), !0;
	}
	return n.set(e, !1), !1;
}
function mn(e) {
	P.schedule(e);
}
function hn(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), N(e, C);
		for (var n = e.first; n !== null;) hn(n, t), n = n.next;
	}
}
function gn(e) {
	N(e, C);
	for (var t = e.first; t !== null;) gn(t), t = t.next;
}
var _n, vn, P, yn, bn, xn, Sn, Cn, wn, Tn, En, Dn, On, kn, An = t((() => {
	T(), it(), x(), W(), Fe(), gt(), a(), yt(), L(), B(), Tt(), Be(), St(), Rt(), st(), zt(), cn(), _n = null, vn = null, P = null, yn = null, bn = null, xn = null, Sn = !1, Cn = !1, wn = null, Tn = null, En = 0, Dn = 1, On = class e {
		id = Dn++;
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
			vn === null ? _n = vn = this : (vn.#n = this, this.#t = vn), vn = this;
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
				for (var r of n.d) N(r, w), t(r);
				for (r of n.m) N(r, ee), t(r);
			}
			this.#p.add(e);
		}
		#g() {
			this.#e = !0, En++ > 1e3 && (this.#S(), un());
			for (let e of this.#u) this.#d.delete(e), N(e, w), this.schedule(e);
			for (let e of this.#d) N(e, ee), this.schedule(e);
			let t = this.#c;
			this.#c = [], this.apply();
			var n = wn = [], r = [], i = Tn = [];
			for (let e of t) try {
				this.#_(e, n, r);
			} catch (t) {
				throw gn(e), this.#h() || this.discard(), t;
			}
			if (P = null, i.length > 0) {
				var a = e.ensure();
				for (let e of i) a.schedule(e);
			}
			if (wn = null, Tn = null, this.#h()) {
				this.#b(r), this.#b(n);
				for (let [e, t] of this.#f) hn(e, t);
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
			this.#r.clear(), yn = this, dn(r), dn(n), yn = null, this.#s?.resolve();
			var s = P;
			if (this.#a === 0 && (this.#c.length === 0 || s !== null) && (this.#S(), nt && (this.#x(), P = s)), this.#c.length > 0) if (s !== null) {
				let e = s;
				e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
			} else s = this;
			s !== null && s.#g();
		}
		#_(e, t, n) {
			e.f ^= C;
			for (var r = e.first; r !== null;) {
				var i = r.f, a = (i & 96) != 0;
				if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
					a ? r.f ^= C : i & 4 ? t.push(r) : nt && i & 16777224 ? n.push(r) : Wr(r) && (i & 16 && this.#d.add(r), Yr(r));
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
						r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), N(i, w), this.schedule(i));
					}
				}
			};
			for (let e of this.current.keys()) t(e);
			this.oncommit(() => e.discard()), e.#S(), P = this, this.#g();
		}
		#b(e) {
			for (var t = 0; t < e.length; t += 1) wt(e[t], this.#u, this.#d);
		}
		capture(e, t, n = !1) {
			e.v !== E && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), bn?.set(e, t)), this.is_fork || (e.v = t);
		}
		activate() {
			P = this;
		}
		deactivate() {
			P = null, bn = null;
		}
		flush() {
			try {
				Cn = !0, P = this, this.#g();
			} finally {
				En = 0, xn = null, wn = null, Tn = null, Cn = !1, P = null, bn = null, Rn.clear();
			}
		}
		discard() {
			for (let e of this.#i) e(this);
			this.#i.clear();
			for (let e of this.async_deriveds.values()) e.reject(sn);
			this.#S(), this.#s?.resolve();
		}
		register_created_effect(e) {
			this.#l.push(e);
		}
		#x() {
			for (let u = _n; u !== null; u = u.#n) {
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
						for (var s of t) fn(s, i, a, o);
						o = /* @__PURE__ */ new Map();
						var c = [...u.current].filter(([e, t]) => {
							let n = this.current.get(e);
							return !n || n[0] !== t[0] || n[1] !== t[1];
						}).map(([e]) => e);
						if (c.length > 0) for (let e of this.#l) !(e.f & 155648) && pn(e, c, o) && (e.f & 4194320 ? (N(e, w), u.schedule(e)) : u.#u.add(e));
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
			this.#m || (this.#m = !0, pt(() => {
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
			return (this.#s ??= c()).promise;
		}
		static ensure() {
			if (P === null) {
				let t = P = new e();
				!Cn && !Sn && pt(() => {
					t.#e || t.flush();
				});
			}
			return P;
		}
		apply() {
			if (!nt || !this.is_fork && this.#t === null && this.#n === null) {
				bn = null;
				return;
			}
			bn = /* @__PURE__ */ new Map();
			for (let [e, [t]] of this.current) bn.set(e, t);
			for (let t = _n; t !== null; t = t.#n) if (!(t === this || t.is_fork)) {
				var e = !1;
				if (t.id < this.id) {
					for (let [n, [, r]] of t.current) if (!r && this.current.has(n)) {
						e = !0;
						break;
					}
				}
				if (!e) for (let [e, n] of t.previous) bn.has(e) || bn.set(e, n);
			}
		}
		schedule(e) {
			if (xn = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
				e.b.defer_effect(e);
				return;
			}
			for (var t = e; t.parent !== null;) {
				t = t.parent;
				var n = t.f;
				if (wn !== null && t === U && (nt || (H === null || !(H.f & 2)) && !Ft)) return;
				if (n & 96) {
					if (!(n & 1024)) return;
					t.f ^= C;
				}
			}
			this.#c.push(t);
		}
		#S() {
			if (this.linked) {
				var e = this.#t, t = this.#n;
				e === null ? _n = t : e.#n = t, t === null ? vn = e : t.#t = e, this.linked = !1;
			}
		}
	}, kn = null;
}));
function jn(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ze,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function F(e, t) {
	let n = jn(e, t);
	return Br(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Mn(e, t = !1, n = !0) {
	let r = jn(e);
	return t || (r.equals = $e), rt && n && j !== null && j.l !== null && (j.l.s ??= []).push(r), r;
}
function I(e, t, n = !1) {
	return H !== null && (!ii || H.f & 131072) && dt() && H.f & 4325394 && (ai === null || !ai.has(e)) && Ne(), Nn(e, n ? Bn(t) : t, Tn);
}
function Nn(e, t, n = null) {
	if (!e.equals(t)) {
		Rn.set(e, ri ? t : e.v);
		var r = On.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && nn(t), bn === null && bt(t);
		}
		e.wv = Ur(), In(e, w, n), dt() && U !== null && U.f & 1024 && !(U.f & 96) && (ci === null ? Vr([e]) : ci.push(e)), !r.is_fork && Ln.size > 0 && !zn && Pn();
	}
	return t;
}
function Pn() {
	zn = !1;
	for (let e of Ln) {
		e.f & 1024 && N(e, ee);
		let t;
		try {
			t = Wr(e);
		} catch {
			t = !0;
		}
		t && Yr(e);
	}
	Ln.clear();
}
function Fn(e) {
	I(e, e.v + 1);
}
function In(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = dt(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (!(!i && s === U)) {
			var l = (c & w) === 0;
			if (l && N(s, t), c & 131072) Ln.add(s);
			else if (c & 2) {
				var u = s;
				bn?.delete(u), c & 65536 || (c & 512 && (U === null || !(U.f & 2097152)) && (s.f |= le), In(u, ee, n));
			} else if (l) {
				var d = s;
				c & 16 && kn !== null && kn.add(d), n === null ? mn(d) : n.push(d);
			}
		}
	}
}
var Ln, Rn, zn, L = t((() => {
	a(), W(), et(), T(), Fe(), it(), ot(), st(), M(), An(), Vn(), cn(), St(), Ln = /* @__PURE__ */ new Set(), Rn = /* @__PURE__ */ new Map(), zn = !1;
}));
//#endregion
//#region node_modules/svelte/src/internal/client/proxy.js
function Bn(e) {
	if (typeof e != "object" || !e || pe in e) return e;
	let t = v(e);
	if (t !== g && t !== _) return e;
	var n = /* @__PURE__ */ new Map(), r = l(e), i = /* @__PURE__ */ F(0), a = null, o = di, s = (e) => {
		if (di === o) return e();
		var t = H, n = di;
		Rr(null), Hr(o);
		var r = e();
		return Rr(t), Hr(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ F(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && je();
			var i = n.get(t);
			return i === void 0 ? s(() => {
				var e = /* @__PURE__ */ F(r.value, a);
				return n.set(t, e), e;
			}) : I(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = s(() => /* @__PURE__ */ F(E, a));
					n.set(t, e), Fn(i);
				}
			} else I(r, E), Fn(i);
			return !0;
		},
		get(t, r, i) {
			if (r === pe) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || m(t, r)?.writable) && (o = s(() => /* @__PURE__ */ F(Bn(c ? t[r] : E), a)), n.set(r, o)), o !== void 0) {
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
			if (t === pe) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== E || Reflect.has(e, t);
			return (r !== void 0 || U !== null && (!i || m(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ F(i ? Bn(e[t]) : E, a)), n.set(t, r)), V(r) === E) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ F(E, a)), n.set(d + "", f)) : I(f, E);
			}
			if (l === void 0) (!u || m(e, t)?.writable) && (l = s(() => /* @__PURE__ */ F(void 0, a)), I(l, Bn(o)), n.set(t, l));
			else {
				u = l.v !== E;
				var p = s(() => Bn(o));
				I(l, p);
			}
			var h = Reflect.getOwnPropertyDescriptor(e, t);
			if (h?.set && h.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var g = n.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && I(g, _ + 1);
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
			Me();
		}
	});
}
var Vn = t((() => {
	a(), W(), x(), L(), T(), Be(), Fe(), ot(), st(), it();
})), Hn = t((() => {
	We(), Vn();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/operations.js
function Un() {
	if (Qn === void 0) {
		Qn = window, $n = document, er = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		tr = m(t, "firstChild").get, nr = m(t, "nextSibling").get, y(e) && (e[_e] = void 0, e[ge] = null, e[ve] = void 0, e.__e = void 0), y(n) && (n[ye] = void 0);
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
function R(e, t) {
	if (!O) return /* @__PURE__ */ Gn(e);
	var n = /* @__PURE__ */ Gn(k);
	if (n === null) n = k.appendChild(Wn());
	else if (t && n.nodeType !== 3) {
		var r = Wn();
		return n?.before(r), Ke(r), r;
	}
	return t && Zn(n), Ke(n), n;
}
function qn(e, t = !1) {
	if (!O) {
		var n = /* @__PURE__ */ Gn(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Kn(n) : n;
	}
	if (t) {
		if (k?.nodeType !== 3) {
			var r = Wn();
			return k?.before(r), Ke(r), r;
		}
		Zn(k);
	}
	return k;
}
function z(e, t = 1, n = !1) {
	let r = O ? k : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ Kn(r);
	if (!O) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = Wn();
			return r === null ? i?.after(a) : r.before(a), Ke(a), a;
		}
		Zn(r);
	}
	return Ke(r), r;
}
function Jn(e) {
	e.textContent = "";
}
function Yn() {
	return !nt || kn !== null ? !1 : (U.f & re) !== 0;
}
function Xn(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function Zn(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
var Qn, $n, er, tr, nr, rr = t((() => {
	A(), a(), Hn(), x(), W(), it(), T(), An(), Be();
})), ir = t((() => {
	A(), rr(), gt(), T();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function ar(e) {
	var t = H, n = U;
	Rr(null), zr(null);
	try {
		return e();
	} finally {
		Rr(t), zr(n);
	}
}
var or = t((() => {
	B(), W(), T(), ir();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function sr(e) {
	U === null && (H === null && Oe(e), De()), ri && Ee(e);
}
function cr(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function lr(e, t) {
	var n = U;
	n !== null && n.f & 8192 && (e |= te);
	var r = {
		ctx: j,
		deps: null,
		nodes: null,
		f: e | w | 512,
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
	if (e & 4) wn === null ? On.ensure().schedule(r) : wn.push(r);
	else if (t !== null) {
		try {
			Yr(r);
		} catch (e) {
			throw Dr(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= ae));
	}
	if (i !== null && (i.parent = n, n !== null && cr(i, n), H !== null && H.f & 2 && !(e & 64))) {
		var a = H;
		(a.effects ??= []).push(i);
	}
	return r;
}
function ur() {
	return H !== null && !ii;
}
function dr(e) {
	let t = lr(8, null);
	return N(t, C), t.teardown = e, t;
}
function fr(e) {
	sr("$effect");
	var t = U.f;
	if (!H && t & 32 && j !== null && !j.i) {
		var n = j;
		(n.e ??= []).push(e);
	} else return pr(e);
}
function pr(e) {
	return lr(4 | se, e);
}
function mr(e) {
	return sr("$effect.pre"), lr(8 | se, e);
}
function hr(e) {
	On.ensure();
	let t = lr(64 | oe, e);
	return () => {
		Dr(t);
	};
}
function gr(e) {
	On.ensure();
	let t = lr(64 | oe, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Ar(t, () => {
			Dr(t), n(void 0);
		}) : (Dr(t), n(void 0));
	});
}
function _r(e) {
	return lr(4, e);
}
function vr(e) {
	return lr(de | oe, e);
}
function yr(e, t = 0) {
	return lr(8 | t, e);
}
function br(e, t = [], n = [], r = []) {
	Kt(r, t, n, (t) => {
		lr(8, () => {
			e(...t.map(V));
		});
	});
}
function xr(e, t = 0) {
	return lr(16 | t, e);
}
function Sr(e, t = 0) {
	return lr(S | t, e);
}
function Cr(e) {
	return lr(32 | oe, e);
}
function wr(e) {
	var t = e.teardown;
	if (t !== null) {
		let e = ri, n = H;
		Lr(!0), Rr(null);
		try {
			t.call(null);
		} finally {
			Lr(e), Rr(n);
		}
	}
}
function Tr(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && ar(() => {
			e.abort(be);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : Dr(n, t), n = r;
	}
}
function Er(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || Dr(t), t = n;
	}
}
function Dr(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Or(e.nodes.start, e.nodes.end), n = !0), e.f |= ie, Tr(e, t && !n), Jr(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	wr(e), e.f ^= ie, e.f |= ne;
	var i = e.parent;
	i !== null && i.first !== null && kr(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Or(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ Kn(e);
		e.remove(), e = n;
	}
}
function kr(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Ar(e, t, n = !0) {
	var r = [];
	jr(e, r, !0);
	var i = () => {
		n && Dr(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function jr(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= te;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = (i.f & 65536) != 0 || (i.f & 32) != 0 && (e.f & 16) != 0;
				jr(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function Mr(e) {
	Nr(e, !0);
}
function Nr(e, t) {
	if (e.f & 8192) {
		e.f ^= te, e.f & 1024 || (N(e, w), On.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = (n.f & 65536) != 0 || (n.f & 32) != 0;
			Nr(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function Pr(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ Kn(n);
		t.append(n), n = i;
	}
}
var B = t((() => {
	W(), T(), Fe(), a(), x(), rr(), M(), An(), Xt(), or(), St();
})), Fr, Ir = t((() => {
	L(), W(), Fr = null;
}));
//#endregion
//#region node_modules/svelte/src/internal/client/runtime.js
function Lr(e) {
	ri = e;
}
function Rr(e) {
	H = e;
}
function zr(e) {
	U = e;
}
function Br(e) {
	H !== null && (!nt || H.f & 2) && (ai ??= /* @__PURE__ */ new Set()).add(e);
}
function Vr(e) {
	ci = e;
}
function Hr(e) {
	di = e;
}
function Ur() {
	return ++li;
}
function Wr(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~le), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Wr(a) && rn(a), a.wv > e.wv) return !0;
		}
		t & 512 && bn === null && N(e, C);
	}
	return !1;
}
function Gr(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(!nt && ai !== null && ai.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? Gr(a, t, !1) : t === a && (n ? N(a, w) : a.f & 1024 && N(a, ee), mn(a));
	}
}
function Kr(e) {
	var t = oi, n = si, r = ci, i = H, a = ai, o = j, s = ii, c = di, l = e.f;
	oi = null, si = 0, ci = null, H = l & 96 ? null : e, ai = null, ct(e.ctx), ii = !1, di = ++ui, e.ac !== null && (ar(() => {
		e.ac.abort(be);
	}), e.ac = null);
	try {
		e.f |= ue;
		var u = e.fn, d = u();
		e.f |= re;
		var f = e.deps, p = P?.is_fork;
		if (oi !== null) {
			var m;
			if (p || Jr(e, si), f !== null && si > 0) for (f.length = si + oi.length, m = 0; m < oi.length; m++) f[si + m] = oi[m];
			else e.deps = f = oi;
			if (ur() && e.f & 512) for (m = si; m < f.length; m++) (f[m].reactions ??= []).push(e);
		} else !p && f !== null && si < f.length && (Jr(e, si), f.length = si);
		if (dt() && ci !== null && !ii && f !== null && !(e.f & 6146)) for (m = 0; m < ci.length; m++) Gr(ci[m], e);
		if (i !== null && i !== e) {
			if (ui++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = ui;
			if (t !== null) for (let e of t) e.rv = ui;
			ci !== null && (r === null ? r = ci : r.push(...ci));
		}
		return e.f & 8388608 && (e.f ^= fe), d;
	} catch (e) {
		return _t(e);
	} finally {
		e.f ^= ue, oi = t, si = n, ci = r, H = i, ai = a, ct(o), ii = s, di = c;
	}
}
function qr(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = u.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (oi === null || !d.call(oi, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512, a.f &= ~le), a.v !== E && bt(a), an(a), Jr(a, 0);
	}
}
function Jr(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) qr(e, n[r]);
}
function Yr(e) {
	var t = e.f;
	if (!(t & 16384)) {
		N(e, C);
		var n = U, r = ni;
		U = e, ni = !0;
		try {
			t & 16777232 ? Er(e) : Tr(e), wr(e);
			var i = Kr(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = li;
		} finally {
			ni = r, U = n;
		}
	}
}
async function Xr() {
	if (nt) return new Promise((e) => {
		requestAnimationFrame(() => e()), setTimeout(() => e());
	});
	await Promise.resolve(), ln();
}
function V(e) {
	var t = (e.f & 2) != 0;
	if (Fr?.add(e), H !== null && !ii && !(U !== null && U.f & 16384) && (ai === null || !ai.has(e))) {
		var n = H.deps;
		if (H.f & 2097152) e.rv < ui && (e.rv = ui, oi === null && n !== null && n[si] === e ? si++ : oi === null ? oi = [e] : oi.push(e));
		else {
			H.deps ??= [], d.call(H.deps, e) || H.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [H] : d.call(r, H) || r.push(H);
		}
	}
	if (ri && Rn.has(e)) return Rn.get(e);
	if (t) {
		var i = e;
		if (ri) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || Qr(i)) && (a = nn(i)), Rn.set(i, a), a;
		}
		var o = (i.f & 512) == 0 && !ii && H !== null && (ni || (H.f & 512) != 0), s = (i.f & re) === 0;
		Wr(i) && (o && (i.f |= 512), rn(i)), o && !s && (on(i), Zr(i));
	}
	if (bn?.has(e)) return bn.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function Zr(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (on(t), Zr(t));
}
function Qr(e) {
	if (e.v === E) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Rn.has(t) || t.f & 2 && Qr(t)) return !0;
	return !1;
}
function $r(e) {
	var t = ii;
	try {
		return ii = !0, e();
	} finally {
		ii = t;
	}
}
function ei(e) {
	if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
		if (pe in e) ti(e);
		else if (!Array.isArray(e)) for (let t in e) {
			let n = e[t];
			typeof n == "object" && n && pe in n && ti(n);
		}
	}
}
function ti(e, t = /* @__PURE__ */ new Set()) {
	if (typeof e == "object" && e && !(e instanceof EventTarget) && !t.has(e)) {
		t.add(e), e instanceof Date && e.getTime();
		for (let n in e) try {
			ti(e[n], t);
		} catch {}
		let n = v(e);
		if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
			let t = h(n);
			for (let n in t) {
				let r = t[n].get;
				if (r) try {
					r.call(e);
				} catch {}
			}
		}
	}
}
var ni, ri, H, ii, U, ai, oi, si, ci, li, ui, di, W = t((() => {
	a(), x(), B(), T(), L(), cn(), it(), ot(), st(), M(), An(), yt(), Be(), Ir(), or(), St(), We(), ni = !1, ri = !1, H = null, ii = !1, U = null, ai = null, oi = null, si = 0, ci = null, li = 1, ui = 0, di = ui;
})), fi = t((() => {
	Y(), Mo(), B();
}));
function pi(e) {
	return hi.includes(e);
}
var mi, hi, gi, _i = t((() => {
	mi = /* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split("."), [...mi], hi = ["touchstart", "touchmove"], gi = [
		"$state",
		"$state.raw",
		"$derived",
		"$derived.by"
	], [...gi];
})), vi = t((() => {
	T(), _i(), W();
})), yi = t((() => {
	T(), A(), M();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
function bi(e, t, n, r = {}) {
	function i(e) {
		if (r.capture || Ci.call(t, e), !e.cancelBubble) return ar(() => n?.call(this, e));
	}
	return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? pt(() => {
		t.addEventListener(e, i, r);
	}) : t.addEventListener(e, i, r), i;
}
function xi(e, t, n, r, i) {
	var a = {
		capture: r,
		passive: i
	}, o = bi(e, t, n, a);
	(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) && dr(() => {
		t.removeEventListener(e, o, a);
	});
}
function G(e, t, n) {
	(t[wi] ??= {})[e] = n;
}
function Si(e) {
	for (var t = 0; t < e.length; t++) Ti.add(e[t]);
	for (var n of Ei) n(e);
}
function Ci(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	Di = e;
	var o = 0, s = Di === e && e[wi];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[wi] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		p(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = H, d = U;
		Rr(null), zr(null);
		try {
			for (var f, m = []; a !== null && a !== t;) {
				try {
					var h = a[wi]?.[r];
					h != null && (!a.disabled || e.target === a) && h.call(a, e);
				} catch (e) {
					f ? m.push(e) : f = e;
				}
				if (e.cancelBubble) break;
				o++, a = o < i.length ? i[o] : null;
			}
			if (f) {
				for (let e of m) queueMicrotask(() => {
					throw e;
				});
				throw f;
			}
		} finally {
			e[wi] = t, delete e.currentTarget, Rr(u), zr(d);
		}
	}
}
var wi, Ti, Ei, Di, Oi = t((() => {
	B(), x(), A(), gt(), W(), or(), wi = Symbol("events"), Ti = /* @__PURE__ */ new Set(), Ei = /* @__PURE__ */ new Set(), Di = null;
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
function ki(e) {
	return ji?.createHTML(e) ?? e;
}
function Ai(e) {
	var t = Xn("template");
	return t.innerHTML = ki(e.replaceAll("<!>", "<!---->")), t.content;
}
var ji, Mi = t((() => {
	rr(), ji = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function Ni(e, t) {
	var n = U;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function Pi(e, t) {
	var n = (t & 1) != 0, r = (t & 2) != 0, i, a = !e.startsWith("<!>");
	return () => {
		if (O) return Ni(k, null), k;
		i === void 0 && (i = Ai(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ Gn(i)));
		var t = r || er ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ Gn(t), s = t.lastChild;
			Ni(o, s);
		} else Ni(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Fi(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = (t & 1) != 0, a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (O) return Ni(k, null), k;
		if (!o) {
			var e = /* @__PURE__ */ Gn(Ai(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ Gn(e);) o.appendChild(/* @__PURE__ */ Gn(e));
			else o = /* @__PURE__ */ Gn(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ Gn(t), r = t.lastChild;
			Ni(n, r);
		} else Ni(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function Ii(e, t) {
	return /* @__PURE__ */ Fi(e, t, "svg");
}
function Li() {
	if (O) return Ni(k, null), k;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = Wn();
	return e.append(t, n), Ni(t, n), e;
}
function K(e, t) {
	if (O) {
		var n = U;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = k), qe();
		return;
	}
	e !== null && e.before(t);
}
var Ri = t((() => {
	A(), rr(), Mi(), W(), Be(), T();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/render.js
function q(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[ye] ??= e.nodeValue) && (e[ye] = n, e.nodeValue = `${n}`);
}
function zi(e, t) {
	return Bi(e, t);
}
function Bi(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	Un();
	var c = void 0, l = gr(() => {
		var l = n ?? t.appendChild(Wn());
		Ht(l, { pending: () => {} }, (t) => {
			lt({});
			var n = j;
			if (a && (n.c = a), i && (r.$$events = i), O && Ni(t, null), Vi = o, c = e(t, r) || {}, Vi = !0, O && (U.nodes.end = k, k === null || k.nodeType !== 8 || k.data !== "]")) throw He(), Ie;
			ut();
		}, s);
		var u = /* @__PURE__ */ new Set(), d = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!u.has(r)) {
					u.add(r);
					var i = pi(r);
					for (let e of [t, document]) {
						var a = Hi.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Hi.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, Ci, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return d(f(Ti)), Ei.add(d), () => {
			for (var e of u) for (let n of [t, document]) {
				var r = Hi.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, Ci), r.delete(e), r.size === 0 && Hi.delete(n)) : r.set(e, i);
			}
			Ei.delete(d), l !== n && l.parentNode?.removeChild(l);
		};
	});
	return Ui.set(c, l), c;
}
var Vi, Hi, Ui, Wi = t((() => {
	a(), rr(), Be(), W(), M(), B(), A(), x(), Oi(), We(), Fe(), Ri(), _i(), T(), Gt(), Vi = !0, Hi = /* @__PURE__ */ new Map(), Ui = /* @__PURE__ */ new WeakMap();
})), Gi = t((() => {
	T(), A(), B(), L(), Wi(), W();
})), Ki = t((() => {
	x(), T(), M(), _i();
})), qi = t((() => {
	Fe(), M();
})), Ji = t((() => {
	at(), B(), W(), st();
})), Yi = t((() => {
	Xt(), W(), A(), Ri();
})), Xi = t((() => {
	Fe();
})), Zi, Qi = t((() => {
	An(), B(), T(), A(), rr(), a(), Zi = class {
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
				if (n) Mr(n), this.#r.delete(t);
				else {
					var r = this.#n.get(t);
					r && (Mr(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
				}
				for (let [t, n] of this.#e) {
					if (this.#e.delete(t), t === e) break;
					let r = this.#n.get(n);
					r && (Dr(r.effect), this.#n.delete(n));
				}
				for (let [e, r] of this.#t) {
					if (e === t || this.#r.has(e)) continue;
					let i = () => {
						if (Array.from(this.#e.values()).includes(e)) {
							var t = document.createDocumentFragment();
							Pr(r, t), t.append(Wn()), this.#n.set(e, {
								effect: r,
								fragment: t
							});
						} else Dr(r);
						this.#r.delete(e), this.#t.delete(e);
					};
					this.#i || !n ? (this.#r.add(e), Ar(r, i, !1)) : i();
				}
			}
		};
		#o = (e) => {
			this.#e.delete(e);
			let t = Array.from(this.#e.values());
			for (let [e, n] of this.#n) t.includes(e) || (Dr(n.effect), this.#n.delete(e));
		};
		ensure(e, t) {
			var n = P, r = Yn();
			if (t && !this.#t.has(e) && !this.#n.has(e)) if (r) {
				var i = document.createDocumentFragment(), a = Wn();
				i.append(a), this.#n.set(e, {
					effect: Cr(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, Cr(() => t(this.anchor)));
			if (this.#e.set(n, e), r) {
				for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
				for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
				n.oncommit(this.#a), n.ondiscard(this.#o);
			} else O && (this.anchor = k), this.#a(n);
		}
	};
})), $i = t((() => {
	x(), B(), L(), A(), gt(), M(), An(), Qi(), Xt();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function ea(e, t, n = !1) {
	var r;
	O && (r = k, qe());
	var i = new Zi(e), a = n ? ae : 0;
	function o(e, t) {
		if (O) {
			var n = Xe(r);
			if (e !== parseInt(n.substring(1))) {
				var a = Ye();
				Ke(a), i.anchor = a, Ge(!1), i.ensure(e, t), Ge(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	xr(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
var ta = t((() => {
	T(), A(), B(), Qi();
})), na = t((() => {
	M(), B(), A(), Qi();
})), ra = t((() => {
	B(), A(), rr();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function ia(e, t) {
	return t;
}
function aa(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Ar(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					oa(e, f(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
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
		oa(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function oa(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= ce, Pr(a, document.createDocumentFragment())) : Dr(t[i], n);
	}
}
function sa(e, t, n, r, i, a = null) {
	var o = e, s = /* @__PURE__ */ new Map();
	if (t & 4) {
		var c = e;
		o = O ? Ke(/* @__PURE__ */ Gn(c)) : c.appendChild(Wn());
	}
	O && qe();
	var u = null, d = /* @__PURE__ */ en(() => {
		var e = n();
		return l(e) ? e : e == null ? [] : f(e);
	}), p, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = u, la(v, p, o, t, r), u !== null && (p.length === 0 ? u.f & 33554432 ? (u.f ^= ce, da(u, null, o)) : Mr(u) : Ar(u, () => {
			u = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: xr(() => {
			p = V(d);
			var e = p.length;
			let c = !1;
			O && Xe(o) === "[!" != (e === 0) && (o = Ye(), Ke(o), Ge(!1), c = !0);
			for (var l = /* @__PURE__ */ new Set(), f = P, v = Yn(), y = 0; y < e; y += 1) {
				O && k.nodeType === 8 && k.data === "]" && (o = k, c = !0, Ge(!1));
				var b = p[y], x = r(b, y), S = h ? null : s.get(x);
				S ? (S.v && Nn(S.v, b), S.i && Nn(S.i, y), v && f.unskip_effect(S.e)) : (S = ua(s, h ? o : pa ??= Wn(), b, x, y, i, t, n), h || (S.e.f |= ce), s.set(x, S)), l.add(x);
			}
			if (e === 0 && a && !u && (h ? u = Cr(() => a(o)) : (u = Cr(() => a(pa ??= Wn())), u.f |= ce)), e > l.size && Te("", "", ""), O && e > 0 && Ke(Ye()), !h) if (m.set(f, l), v) {
				for (let [e, t] of s) l.has(e) || f.skip_effect(t.e);
				f.oncommit(g), f.ondiscard(_);
			} else g(f);
			c && Ge(!0), V(d);
		}),
		flags: t,
		items: s,
		pending: m,
		outrogroups: null,
		fallback: u
	};
	h = !1, O && (o = k);
}
function ca(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function la(e, t, n, r, i) {
	var a = (r & 8) != 0, o = t.length, s = e.items, c = ca(e.effect.first), l, u = null, d, p = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (d ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (Mr(_), a && (_.nodes?.a?.unfix(), (d ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) if (_.f ^= ce, _ === c) da(_, null, n);
		else {
			var y = u ? u.next : c;
			_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), fa(e, u, _), fa(e, _, y), da(_, y, n), u = _, p = [], m = [], c = ca(u.next);
			continue;
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (p.length < m.length) {
					var b = m[0], x;
					u = b.prev;
					var S = p[0], C = p[p.length - 1];
					for (x = 0; x < p.length; x += 1) da(p[x], b, n);
					for (x = 0; x < m.length; x += 1) l.delete(m[x]);
					fa(e, S.prev, C.next), fa(e, u, S), fa(e, C, b), c = b, u = C, --v, p = [], m = [];
				} else l.delete(_), da(_, c, n), fa(e, _.prev, _.next), fa(e, _, u === null ? e.effect.first : u.next), fa(e, u, _), u = _;
				continue;
			}
			for (p = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = ca(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || p.push(_), u = _, c = ca(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (oa(e, f(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var w = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || w.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && w.push(c), c = ca(c.next);
		var ee = w.length;
		if (ee > 0) {
			var te = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.measure();
				for (v = 0; v < ee; v += 1) w[v].nodes?.a?.fix();
			}
			aa(e, w, te);
		}
	}
	a && pt(() => {
		if (d !== void 0) for (_ of d) _.nodes?.a?.apply();
	});
}
function ua(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? jn(n) : /* @__PURE__ */ Mn(n, !1, !1) : null, l = o & 2 ? jn(i) : null;
	return {
		v: c,
		i: l,
		e: Cr(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function da(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ Kn(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function fa(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
var pa, ma = t((() => {
	Be(), A(), rr(), B(), L(), x(), T(), gt(), W(), a(), cn(), An(), Fe(), ot();
}));
function ha(e, t, n = !1, r = !1, i = !1, a = !1) {
	var o = e, s = "";
	if (n) {
		var c = e;
		O && (o = Ke(/* @__PURE__ */ Gn(c)));
	}
	br(() => {
		var e = U;
		if (s === (s = t() ?? "")) {
			O && qe();
			return;
		}
		if (n && !O) {
			e.nodes = null, c.innerHTML = s, s !== "" && Ni(/* @__PURE__ */ Gn(c), c.lastChild);
			return;
		}
		if (e.nodes !== null && (Or(e.nodes.start, e.nodes.end), e.nodes = null), s !== "") {
			if (O) {
				for (var a = k.data, l = qe(), u = l; l !== null && (l.nodeType !== 8 || l.data !== "");) u = l, l = /* @__PURE__ */ Kn(l);
				if (l === null) throw He(), Ie;
				Ni(k, u), o = Ke(l);
				return;
			}
			var d = Xn(r ? "svg" : i ? "math" : "template", r ? Re : i ? ze : void 0);
			d.innerHTML = s;
			var f = r || i ? d : d.content;
			if (Ni(/* @__PURE__ */ Gn(f), f.lastChild), r || i) for (; /* @__PURE__ */ Gn(f);) o.before(/* @__PURE__ */ Gn(f));
			else o.before(f);
		}
	});
}
var ga = t((() => {
	Be(), B(), A(), Ri(), We(), _i(), a(), M(), rr(), W(), T();
})), _a = t((() => {
	A();
})), va = t((() => {
	_i(), Ce();
})), ya = t((() => {
	T(), B(), M(), A(), Mi(), Ri(), Fe(), rr(), va(), Qi();
})), ba = t((() => {
	T(), B(), A(), Qi();
})), xa, Sa, Ca = t((() => {
	x(), a(), xa = () => performance.now(), Sa = {
		tick: (e) => requestAnimationFrame(e),
		now: () => xa(),
		tasks: /* @__PURE__ */ new Set()
	};
}));
//#endregion
//#region node_modules/svelte/src/internal/client/loop.js
function wa() {
	let e = Sa.now();
	Sa.tasks.forEach((t) => {
		t.c(e) || (Sa.tasks.delete(t), t.f());
	}), Sa.tasks.size !== 0 && Sa.tick(wa);
}
function Ta(e) {
	let t;
	return Sa.tasks.size === 0 && Sa.tick(wa), {
		promise: new Promise((n) => {
			Sa.tasks.add(t = {
				c: e,
				f: n
			});
		}),
		abort() {
			Sa.tasks.delete(t);
		}
	};
}
var Ea = t((() => {
	Ca();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/transitions.js
function Da(e, t) {
	ar(() => {
		e.dispatchEvent(new CustomEvent(t));
	});
}
function Oa(e) {
	if (e === "float") return "cssFloat";
	if (e === "offset") return "cssOffset";
	if (e.startsWith("--")) return e;
	let t = e.split("-");
	return t.length === 1 ? t[0] : t[0] + t.slice(1).map((e) => e[0].toUpperCase() + e.slice(1)).join("");
}
function ka(e) {
	let t = {}, n = e.split(";");
	for (let e of n) {
		let [n, r] = e.split(":");
		if (!n || r === void 0) break;
		let i = Oa(n.trim());
		t[i] = r.trim();
	}
	return t;
}
function Aa(e, t, n, r) {
	var i = (e & 1) != 0, a = (e & 2) != 0, o = i && a, s = (e & 4) != 0, c = o ? "both" : i ? "in" : "out", l, u = t.inert, d = t.style.overflow, f, p;
	function m() {
		return ar(() => l ??= n()(t, r?.() ?? {}, { direction: c }));
	}
	var h = {
		is_global: s,
		in() {
			if (t.inert = u, !i) {
				p?.abort(), p?.reset?.();
				return;
			}
			a || f?.abort(), f = ja(t, m(), p, 1, () => {
				Da(t, "introstart");
			}, () => {
				Da(t, "introend"), f?.abort(), f = l = void 0, t.style.overflow = d;
			});
		},
		out(e) {
			if (!a) {
				e?.(), l = void 0;
				return;
			}
			t.inert = !0, p = ja(t, m(), f, 0, () => {
				Da(t, "outrostart");
			}, () => {
				Da(t, "outroend"), e?.();
			});
		},
		stop: () => {
			f?.abort(), p?.abort();
		}
	}, g = U;
	if ((g.nodes.t ??= []).push(h), i && Vi) {
		var _ = s;
		if (!_) {
			for (var v = g.parent; v && v.f & 65536;) for (; (v = v.parent) && !(v.f & 16););
			_ = !v || (v.f & 32768) != 0;
		}
		_ && _r(() => {
			$r(() => h.in());
		});
	}
}
function ja(e, t, n, r, i, a) {
	var s = r === 1;
	if (o(t)) {
		var c, l = !1;
		return pt(() => {
			l || (c = ja(e, t({ direction: s ? "in" : "out" }), n, r, i, a));
		}), {
			abort: () => {
				l = !0, c?.abort();
			},
			deactivate: () => c.deactivate(),
			reset: () => c.reset(),
			t: () => c.t()
		};
	}
	if (n?.deactivate(), !t?.duration && !t?.delay) return i(), a(), {
		abort: b,
		deactivate: b,
		reset: b,
		t: () => r
	};
	let { delay: u = 0, css: d, tick: f, easing: p = Ma } = t;
	var m = [];
	if (s && n === void 0 && (f && f(0, 1), d)) {
		var h = ka(d(0, 1));
		m.push(h, h);
	}
	var g = () => 1 - r, _ = e.animate(m, {
		duration: u,
		fill: "forwards"
	});
	return _.onfinish = () => {
		_.cancel(), i();
		var o = n?.t() ?? 1 - r;
		n?.abort();
		var s = r - o, c = t.duration * Math.abs(s), l = [];
		if (c > 0) {
			var u = !1;
			if (d) for (var m = Math.ceil(c / (1e3 / 60)), h = 0; h <= m; h += 1) {
				var v = o + s * p(h / m), y = ka(d(v, 1 - v));
				l.push(y), u ||= y.overflow === "hidden";
			}
			u && (e.style.overflow = "hidden"), g = () => {
				var e = _.currentTime;
				return o + s * p(e / c);
			}, f && Ta(() => {
				if (_.playState !== "running") return !1;
				var e = g();
				return f(e, 1 - e), !0;
			});
		}
		_ = e.animate(l, {
			duration: c,
			fill: "forwards"
		}), _.onfinish = () => {
			g = () => r, f?.(r, 1 - r), a();
		};
	}, {
		abort: () => {
			_ && (_.cancel(), _.effect = null, _.onfinish = b);
		},
		deactivate: () => {
			a = b;
		},
		reset: () => {
			r === 0 && f?.(1, 0);
		},
		t: () => g()
	};
}
var Ma, Na = t((() => {
	x(), B(), W(), Ea(), Wi(), Be(), T(), gt(), or(), Ma = (e) => e;
})), Pa = t((() => {
	A(), rr(), B(), Wi(), W(), M(), T(), Ri(), _i(), Qi(), Na();
})), Fa = t((() => {
	A(), rr(), B(), T();
})), Ia = t((() => {
	B(), rr();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/actions.js
function La(e, t, n) {
	_r(() => {
		var r = $r(() => t(e, n?.()) || {});
		if (n && r?.update) {
			var i = !1, a = {};
			yr(() => {
				var e = n();
				ei(e), i && Qe(a, e) && (a = e, r.update(e));
			}), i = !0;
		}
		if (r?.destroy) return () => r.destroy();
	});
}
var Ra = t((() => {
	B(), et(), W();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attachments.js
function za(e, t) {
	var n = void 0, r;
	Sr(() => {
		n !== (n = t()) && (r &&= (Dr(r), null), n && (r = Cr(() => {
			_r(() => n(e));
		})));
	});
}
var Ba = t((() => {
	B();
}));
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
function Va(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Ga.includes(r[o - 1])) && (s === r.length || Ga.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
function Ha(e, t = !1) {
	var n = t ? " !important;" : ";", r = "";
	for (var i of Object.keys(e)) {
		var a = e[i];
		a != null && a !== "" && (r += " " + i + ": " + a + n);
	}
	return r;
}
function Ua(e) {
	return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function Wa(e, t) {
	if (t) {
		var n = "", r, i;
		if (Array.isArray(t) ? (r = t[0], i = t[1]) : r = t, e) {
			e = String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
			var a = !1, o = 0, s = !1, c = [];
			r && c.push(...Object.keys(r).map(Ua)), i && c.push(...Object.keys(i).map(Ua));
			var l = 0, u = -1;
			let t = e.length;
			for (var d = 0; d < t; d++) {
				var f = e[d];
				if (s ? f === "/" && e[d - 1] === "*" && (s = !1) : a ? a === f && (a = !1) : f === "/" && e[d + 1] === "*" ? s = !0 : f === "\"" || f === "'" ? a = f : f === "(" ? o++ : f === ")" && o--, !s && a === !1 && o === 0) {
					if (f === ":" && u === -1) u = d;
					else if (f === ";" || d === t - 1) {
						if (u !== -1) {
							var p = Ua(e.substring(l, u).trim());
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
		return r && (n += Ha(r)), i && (n += Ha(i, !0)), n = n.trim(), n === "" ? null : n;
	}
	return e == null ? null : String(e);
}
var Ga, Ka = t((() => {
	x(), Ga = [..." 	\n\r\f\xA0\v﻿"];
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function qa(e, t, n, r, i, a) {
	var o = e[_e];
	if (O || o !== n || o === void 0) {
		var s = Va(n, r, a);
		(!O || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[_e] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
var Ja = t((() => {
	Ka(), T(), A();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/style.js
function Ya(e, t = {}, n, r) {
	for (var i in n) {
		var a = n[i];
		t[i] !== a && (n[i] == null ? e.style.removeProperty(i) : e.style.setProperty(i, a, r));
	}
}
function Xa(e, t, n, r) {
	var i = e[ve];
	if (O || i !== t) {
		var a = Wa(t, r);
		(!O || a !== e.getAttribute("style")) && (a == null ? e.removeAttribute("style") : e.style.cssText = a), e[ve] = t;
	} else r && (Array.isArray(r) ? (Ya(e, n?.[0], r[0]), Ya(e, n?.[1], r[1], "important")) : Ya(e, n, r));
	return r;
}
var Za = t((() => {
	Ka(), T(), A();
})), Qa = t((() => {
	B(), or(), Vn(), x(), An();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
function J(e, t, n, r) {
	var i = $a(e);
	O && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === ro) || i[t] !== (i[t] = n) && (t === "loading" && (e[he] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && eo(e).includes(t) ? e[t] = n : e.setAttribute(t, n));
}
function $a(e) {
	return e[ge] ??= {
		[to]: e.nodeName.includes("-"),
		[no]: e.namespaceURI === Le
	};
}
function eo(e) {
	var t = e.getAttribute("is") || e.nodeName, n = io.get(t);
	if (n) return n;
	io.set(t, n = []);
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = h(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.push(o);
		i = v(i);
	}
	return n;
}
var to, no, ro, io, ao = t((() => {
	a(), A(), x(), Oi(), ir(), We(), T(), gt(), _i(), W(), Ba(), Ka(), Ja(), Za(), Be(), B(), Qa(), Xt(), to = Symbol("is custom element"), no = Symbol("is html"), ro = xe ? "link" : "LINK", io = /* @__PURE__ */ new Map();
})), oo = t((() => {
	A(), rr(), Mi(), Ba();
})), so = t((() => {
	or();
})), co = t((() => {
	B(), or(), Fe(), Vn(), gt(), A(), W(), An();
})), lo = t((() => {
	B(), or();
})), uo = t((() => {
	or();
})), fo = t((() => {
	B(), x();
})), po = t((() => {
	B(), W();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function mo(e, t) {
	return e === t || e?.[pe] === t;
}
function ho(e = {}, t, n, r) {
	var i = j.r, a = U;
	return _r(() => {
		var o, s;
		return yr(() => {
			o = s, s = r?.() || [], $r(() => {
				mo(n(...s), e) || (t(e, ...s), o && mo(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && mo(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
var go = t((() => {
	T(), M(), B(), W();
})), _o = t((() => {
	B(), or();
})), vo = t((() => {
	B(), or();
})), yo = t((() => {
	x(), B(), Oi();
})), bo = t((() => {
	x(), M(), cn(), B(), W();
})), xo = t((() => {
	L(), W(), x();
}));
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/props.js
function So(e, t, n, r) {
	var i = !rt || (n & 2) != 0, a = (n & 8) != 0, o = (n & 16) != 0, s = r, c = !0, l = void 0, u = () => o && i ? (l ??= /* @__PURE__ */ Zt(r), V(l)) : (c && (c = !1, s = o ? $r(r) : r), s);
	let d;
	if (a) {
		var f = pe in e || me in e;
		d = m(e, t)?.set ?? (f && t in e ? (n) => e[t] = n : void 0);
	}
	var p, h = !1;
	a ? [p, h] = Pt(() => e[t]) : p = e[t], p === void 0 && r !== void 0 && (p = u(), d && (i && Ae(t), d(p)));
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
	var v = !1, y = (n & 1 ? Zt : en)(() => (v = !1, g()));
	a && V(y);
	var b = U;
	return (function(e, t) {
		if (arguments.length > 0) {
			let n = t ? V(y) : i && a ? Bn(e) : e;
			return I(y, n), v = !0, s !== void 0 && (s = n), e;
		}
		return ri && v || b.f & 16384 ? y.v : V(y);
	});
}
var Co = t((() => {
	a(), Be(), x(), L(), cn(), W(), Fe(), T(), Vn(), Rt(), it(), B();
})), wo = t((() => {
	M(), B(), Rt(), Xt();
})), To = t((() => {
	T(), B(), L(), Wi(), W(), An(), x(), Fe(), M(), it(), St(), yo();
})), Eo = t((() => {
	To(), B(), Ri(), x(), rr();
})), Do = t((() => {
	T(), at(), W();
})), Y = t((() => {
	fi(), Be(), M(), vi(), yi(), Gi(), Ki(), qi(), ot(), Ji(), Yi(), Xi(), $i(), ta(), na(), ra(), ma(), ga(), _a(), ya(), ba(), Pa(), Fa(), Ia(), Ra(), Ba(), ao(), Ja(), Oi(), ir(), oo(), Za(), Na(), so(), co(), lo(), uo(), fo(), Qa(), po(), go(), _o(), vo(), A(), yo(), bo(), xo(), Ri(), Xt(), An(), cn(), B(), L(), Co(), Rt(), Gt(), Ir(), Wi(), W(), wo(), Ca(), Vn(), Eo(), rr(), Ka(), at(), x(), va(), Hn(), Do();
})), Oo = t((() => {
	A(), Fe();
}));
//#endregion
//#region node_modules/svelte/src/index-client.js
function ko(e) {
	j === null && Se("onMount"), rt && j.l !== null ? jo(j).m.push(e) : fr(() => {
		let t = $r(e);
		if (typeof t == "function") return t;
	});
}
function Ao(e) {
	j === null && Se("onDestroy"), ko(() => () => $r(e));
}
function jo(e) {
	var t = e.l;
	return t.u ??= {
		a: [],
		b: [],
		m: []
	};
}
var Mo = t((() => {
	W(), x(), Y(), Fe(), it(), M(), a(), An(), Oo(), Wi(), ya();
})), No = t((() => {})), Po = t((() => {
	No(), typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
}));
//#endregion
//#region src/portfolio/startup-motion.ts
function Fo(e, t) {
	let n = document.documentElement, r = document.getElementById("desktop-boot"), i = r?.querySelector("img");
	if (!r || !i || !e || t || typeof i.animate != "function") return () => {};
	let a = i.getBoundingClientRect(), o = e.getBoundingClientRect();
	if (!a.width || !o.width) return () => {};
	n.classList.add("desktop-entering"), e.style.visibility = "hidden";
	let s = i.parentElement, c = i.nextSibling;
	r.append(i), Object.assign(i.style, {
		position: "fixed",
		left: `${a.left}px`,
		top: `${a.top}px`,
		width: `${a.width}px`,
		height: `${a.height}px`,
		margin: "0",
		transformOrigin: "top left"
	});
	let l = r.querySelector(".boot-content");
	l && (l.style.visibility = "hidden");
	let u = [r.animate([{ backgroundColor: "#000" }, { backgroundColor: "transparent" }], {
		duration: 850,
		easing: "cubic-bezier(.22,1,.36,1)",
		fill: "forwards"
	}), i.animate([{ transform: "translate(0,0) scale(1)" }, { transform: `translate(${o.left - a.left}px,${o.top - a.top}px) scale(${o.width / a.width},${o.height / a.height})` }], {
		duration: 1e3,
		easing: "cubic-bezier(.65,0,.2,1)",
		fill: "forwards"
	})], d = !1;
	function f() {
		d || (d = !0, e.style.visibility = "", n.classList.remove("desktop-entering"), u.forEach((e) => e.cancel()), i.removeAttribute("style"), s.insertBefore(i, c), l && (l.style.visibility = ""), window.removeEventListener("resize", f), p.removeEventListener("change", m));
	}
	let p = matchMedia("(prefers-reduced-motion: reduce)"), m = () => {
		p.matches && f();
	};
	return window.addEventListener("resize", f, { once: !0 }), p.addEventListener("change", m), Promise.all(u.map((e) => e.finished)).then(f, f), f;
}
var Io = t((() => {})), X, Lo = t((() => {
	Y(), X = Bn({
		locale: document.documentElement.lang,
		reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
		compact: innerWidth <= 720,
		scrollable: !1
	});
}));
//#endregion
//#region src/portfolio/project-details.ts
function Ro(e, t, n) {
	let r = document.createElement("article");
	r.id = e.hash, r.className = "mac-extra-project mac-detail", r.dataset.projectDetail = e.id;
	let i = (e, n) => `<${e} data-desktop-text="${n}">${t(n)}</${e}>`, a = ["labware", "easyui"].includes(e.id), o = e.id === "labware" ? "7" : "2", s = a ? `<video controls playsinline preload="metadata" poster="./assets/videos/${e.id}-poster.jpg?v=${o}"><source src="./assets/videos/${e.id}.mp4?v=${o}" type="video/mp4" /></video>` : `<img src="./assets/project-icons/${n}" alt="${e.repo}" loading="lazy" decoding="async" />`, c = Vo[e.id];
	return r.innerHTML = `<header><p class="eyebrow">${e.repo}</p><h2>${t(e.id)}</h2>${i("p", `${e.id}.summary`)}</header>
    <figure class="mac-detail-media ${a ? "" : "mac-detail-brand"}">${s}${i("figcaption", `${e.id}.caption`)}</figure>
    <section>${i("h3", "detail.features")}${i("p", `${e.id}.features`)}</section>
    ${i("p", `${e.id}.note`)}
    <nav class="mac-detail-links">${c ? `<a class="text-link" href="https://jason-chen-coder.github.io/${c}" target="_blank" rel="noopener noreferrer">${i("span", "detail.demo")} ↗</a>` : ""}<a class="text-link" href="https://github.com/Jason-chen-coder/${e.repo}" target="_blank" rel="noopener noreferrer">${i("span", "detail.source")} ↗</a></nav>`, r.querySelector("h2").dataset.desktopText = e.id, r;
}
var zo, Bo, Vo, Ho = t((() => {
	zo = {
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
	}, Bo = {
		"zh-CN": {},
		en: {}
	};
	for (let [e, t] of Object.entries(zo)) for (let [n, r] of Object.entries(t)) Bo["zh-CN"][`${e}.${n}`] = r[0], Bo.en[`${e}.${n}`] = r[1];
	Object.assign(Bo["zh-CN"], {
		"detail.features": "核心能力",
		"detail.demo": "打开在线体验",
		"detail.source": "查看源码",
		"detail.archived": "更多探索"
	}), Object.assign(Bo.en, {
		"detail.features": "Core capabilities",
		"detail.demo": "Try the live demo",
		"detail.source": "View source",
		"detail.archived": "More explorations"
	}), Vo = {
		labware: "labware-creator-agent/",
		easyui: "EasyUI/",
		flutterflow: "Flutter-EasyFlow/"
	};
})), Uo, Z, Wo, Go, Ko, qo, Jo, Yo, Xo, Zo, Qo, $o = t((() => {
	Lo(), Ho(), Uo = {
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
	}, Object.assign(Uo["zh-CN"], {
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
	}), Object.assign(Uo.en, {
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
	}), Object.assign(Uo["zh-CN"], Bo["zh-CN"], {
		labware: "Labware Creator",
		easyui: "EasyUI",
		flutterflow: "Flutter EasyFlow",
		projects: "全部项目"
	}), Object.assign(Uo.en, Bo.en, {
		labware: "Labware Creator",
		easyui: "EasyUI",
		flutterflow: "Flutter EasyFlow",
		projects: "All projects"
	}), Z = (e) => Uo[X.locale === "en" ? "en" : "zh-CN"][e] || e, Wo = (e) => `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${e}</svg>`, Go = {
		about: Wo("<path d=\"M5 10a6 6 0 0 1 6-6h13v40H11a6 6 0 0 1-6-6Z\" fill=\"#8cdcff\"/><path d=\"M24 4h13a6 6 0 0 1 6 6v28a6 6 0 0 1-6 6H24Z\" fill=\"#f2f4ef\"/><path d=\"M24 4c-5 8-8 17-5 22h8v12\" stroke=\"#2475b0\" stroke-width=\"2\"/><path d=\"M12 16v3m23-3v3m-23 10c6 7 17 7 23 0\" stroke=\"#1d4674\" stroke-width=\"2.3\" stroke-linecap=\"round\"/>"),
		projects: Wo("<path d=\"M3 13a4 4 0 0 1 4-4h12l5 5h17a4 4 0 0 1 4 4v22H3Z\" fill=\"#8be0ff\"/><path d=\"M3 20a4 4 0 0 1 4-4h34a4 4 0 0 1 4 4v17a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z\" fill=\"#3aaff1\"/><path d=\"m19 24-5 5 5 5m10-10 5 5-5 5\" stroke=\"#e7f8ff\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>"),
		craft: Wo("<rect x=\"5\" y=\"4\" width=\"38\" height=\"40\" rx=\"8\" fill=\"#fff8dd\"/><path d=\"M5 12a8 8 0 0 1 8-8h22a8 8 0 0 1 8 8v3H5Z\" fill=\"#ffd657\"/><path d=\"M13 23h23m-23 7h23m-23 7h15\" stroke=\"#a7a391\" stroke-width=\"2\" stroke-linecap=\"round\"/><path d=\"m29 33 10-10 3 3-10 10-5 2Z\" fill=\"#e79c30\"/>"),
		ai: Wo("<rect x=\"3\" y=\"3\" width=\"42\" height=\"42\" rx=\"12\" fill=\"#9b67db\"/><path d=\"m24 9 4.3 10.7L39 24l-10.7 4.3L24 39l-4.3-10.7L9 24l10.7-4.3Z\" fill=\"#fff5fa\"/><path d=\"m36 7 1.4 3.6L41 12l-3.6 1.4L36 17l-1.4-3.6L31 12l3.6-1.4Z\" fill=\"#f5d387\"/>"),
		contact: Wo("<rect x=\"3\" y=\"6\" width=\"42\" height=\"36\" rx=\"9\" fill=\"#398ef5\"/><path d=\"M8 13h32v24H8Z\" fill=\"#fafcff\"/><path d=\"m8 13 16 13 16-13M8 37l12-14m20 14L28 23\" stroke=\"#85b7ee\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>"),
		github: Wo("<rect x=\"3\" y=\"3\" width=\"42\" height=\"42\" rx=\"12\" fill=\"#292d38\"/><path d=\"M16 35c-1-5 0-7 3-8-7-1-9-8-6-12l-1-6 7 3a19 19 0 0 1 10 0l7-3-1 6c3 4 1 11-6 12 3 1 4 4 3 10H16\" fill=\"#faf8f4\"/><path d=\"M17 32c-7 2-6-5-10-4\" stroke=\"#faf8f4\" stroke-width=\"2\" stroke-linecap=\"round\"/>")
	}, Ko = [
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
	], qo = {
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
	}, Ko.forEach((e) => {
		Go[e.id] = `<span class="mac-project-icon mac-project-icon--${e.id}" data-project-icon="${e.id}"><img src="./assets/project-icons/${qo[e.id]}" alt="" draggable="false" decoding="async" /></span>`, e.content ||= Ro(e, Z, qo[e.id]), e.content.classList.add("mac-project-content");
	}), Jo = document.getElementById("opensource"), Yo = document.createElement("div"), Yo.className = "mac-project-directory", Yo.innerHTML = `<p data-desktop-text="directory">${Z("directory")}</p><div class="mac-project-launchers">${Ko.filter((e) => !e.archived).map((e) => `<button data-app-open="${e.id}" class="mac-project-launcher"><span class="mac-directory-icon">${Go[e.id]}</span><span><strong data-desktop-text="${e.key}">${Z(e.key)}</strong><small>${e.repo}</small></span><span aria-hidden="true">↗</span></button>`).join("")}</div>`, Jo.querySelector(".project-ledger").after(Yo), Jo.querySelector(".more-projects").remove(), Xo = [
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
		...Ko,
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
	], Zo = [...Xo.filter((e) => e.dock !== !1), {
		id: "github",
		key: "github"
	}], Qo = Object.fromEntries(Xo.map((e) => [e.id, {
		...e,
		should_open_window: !0,
		expandable: !0,
		width: 1050,
		height: 720
	}]));
})), es, ts, ns = t((() => {
	es = function() {}, ts = function() {};
})), rs, is = t((() => {
	rs = (e, t, n) => Math.min(Math.max(n, e), t);
})), as, os = t((() => {
	as = (e, t, n) => {
		let r = t - e;
		return r === 0 ? 1 : (n - e) / r;
	};
})), ss, cs = t((() => {
	ss = (e, t, n) => -n * e + n * t + e;
}));
//#endregion
//#region node_modules/style-value-types/dist/es/utils.mjs
function ls(e) {
	return typeof e == "string";
}
var us, ds, fs, ps, ms, hs = t((() => {
	us = (e, t) => (n) => Math.max(Math.min(n, t), e), ds = (e) => e % 1 ? Number(e.toFixed(5)) : e, fs = /(-)?([\d]*\.?[\d])+/g, ps = /(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi, ms = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;
})), gs, _s, vs = t((() => {
	hs(), gs = {
		test: (e) => typeof e == "number",
		parse: parseFloat,
		transform: (e) => e
	}, _s = Object.assign(Object.assign({}, gs), { transform: us(0, 1) }), Object.assign(Object.assign({}, gs), { default: 1 });
})), ys, bs, xs = t((() => {
	hs(), ys = (e) => ({
		test: (t) => ls(t) && t.endsWith(e) && t.split(" ").length === 1,
		parse: parseFloat,
		transform: (t) => `${t}${e}`
	}), ys("deg"), bs = ys("%"), ys("px"), ys("vh"), ys("vw"), Object.assign(Object.assign({}, bs), {
		parse: (e) => bs.parse(e) / 100,
		transform: (e) => bs.transform(e * 100)
	});
})), Ss, Cs, ws = t((() => {
	hs(), Ss = (e, t) => (n) => !!(ls(n) && ms.test(n) && n.startsWith(e) || t && Object.prototype.hasOwnProperty.call(n, t)), Cs = (e, t, n) => (r) => {
		if (!ls(r)) return r;
		let [i, a, o, s] = r.match(fs);
		return {
			[e]: parseFloat(i),
			[t]: parseFloat(a),
			[n]: parseFloat(o),
			alpha: s === void 0 ? 1 : parseFloat(s)
		};
	};
})), Ts, Es = t((() => {
	vs(), xs(), hs(), ws(), Ts = {
		test: Ss("hsl", "hue"),
		parse: Cs("hue", "saturation", "lightness"),
		transform: ({ hue: e, saturation: t, lightness: n, alpha: r = 1 }) => "hsla(" + Math.round(e) + ", " + bs.transform(ds(t)) + ", " + bs.transform(ds(n)) + ", " + ds(_s.transform(r)) + ")"
	};
})), Ds, Os, ks, As = t((() => {
	vs(), hs(), ws(), Ds = us(0, 255), Os = Object.assign(Object.assign({}, gs), { transform: (e) => Math.round(Ds(e)) }), ks = {
		test: Ss("rgb", "red"),
		parse: Cs("red", "green", "blue"),
		transform: ({ red: e, green: t, blue: n, alpha: r = 1 }) => "rgba(" + Os.transform(e) + ", " + Os.transform(t) + ", " + Os.transform(n) + ", " + ds(_s.transform(r)) + ")"
	};
}));
//#endregion
//#region node_modules/style-value-types/dist/es/color/hex.mjs
function js(e) {
	let t = "", n = "", r = "", i = "";
	return e.length > 5 ? (t = e.substr(1, 2), n = e.substr(3, 2), r = e.substr(5, 2), i = e.substr(7, 2)) : (t = e.substr(1, 1), n = e.substr(2, 1), r = e.substr(3, 1), i = e.substr(4, 1), t += t, n += n, r += r, i += i), {
		red: parseInt(t, 16),
		green: parseInt(n, 16),
		blue: parseInt(r, 16),
		alpha: i ? parseInt(i, 16) / 255 : 1
	};
}
var Ms, Ns = t((() => {
	As(), ws(), Ms = {
		test: Ss("#"),
		parse: js,
		transform: ks.transform
	};
})), Ps, Fs = t((() => {
	hs(), Ns(), Es(), As(), Ps = {
		test: (e) => ks.test(e) || Ms.test(e) || Ts.test(e),
		parse: (e) => ks.test(e) ? ks.parse(e) : Ts.test(e) ? Ts.parse(e) : Ms.parse(e),
		transform: (e) => ls(e) ? e : e.hasOwnProperty("red") ? ks.transform(e) : Ts.transform(e)
	};
}));
//#endregion
//#region node_modules/style-value-types/dist/es/complex/index.mjs
function Is(e) {
	return isNaN(e) && ls(e) && (e.match(fs)?.length ?? 0) + (e.match(ps)?.length ?? 0) > 0;
}
function Ls(e) {
	typeof e == "number" && (e = `${e}`);
	let t = [], n = 0, r = e.match(ps);
	r && (n = r.length, e = e.replace(ps, Vs), t.push(...r.map(Ps.parse)));
	let i = e.match(fs);
	return i && (e = e.replace(fs, Hs), t.push(...i.map(gs.parse))), {
		values: t,
		numColors: n,
		tokenised: e
	};
}
function Rs(e) {
	return Ls(e).values;
}
function zs(e) {
	let { values: t, numColors: n, tokenised: r } = Ls(e), i = t.length;
	return (e) => {
		let t = r;
		for (let r = 0; r < i; r++) t = t.replace(r < n ? Vs : Hs, r < n ? Ps.transform(e[r]) : ds(e[r]));
		return t;
	};
}
function Bs(e) {
	let t = Rs(e);
	return zs(e)(t.map(Us));
}
var Vs, Hs, Us, Ws, Gs = t((() => {
	Fs(), vs(), hs(), Vs = "${c}", Hs = "${n}", Us = (e) => typeof e == "number" ? 0 : e, Ws = {
		test: Is,
		parse: Rs,
		createTransformer: zs,
		getAnimatableNone: Bs
	};
})), Ks = t((() => {
	vs(), xs(), Es(), As(), Ns(), Fs(), Gs(), hs();
}));
//#endregion
//#region node_modules/popmotion/dist/es/utils/hsla-to-rgba.mjs
function qs(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e;
}
function Js({ hue: e, saturation: t, lightness: n, alpha: r }) {
	e /= 360, t /= 100, n /= 100;
	let i = 0, a = 0, o = 0;
	if (!t) i = a = o = n;
	else {
		let r = n < .5 ? n * (1 + t) : n + t - n * t, s = 2 * n - r;
		i = qs(s, r, e + 1 / 3), a = qs(s, r, e), o = qs(s, r, e - 1 / 3);
	}
	return {
		red: Math.round(i * 255),
		green: Math.round(a * 255),
		blue: Math.round(o * 255),
		alpha: r
	};
}
var Ys = t((() => {})), Xs, Zs, Qs, $s, ec, tc = t((() => {
	cs(), Ks(), ns(), Ys(), Xs = (e, t, n) => {
		let r = e * e, i = t * t;
		return Math.sqrt(Math.max(0, n * (i - r) + r));
	}, Zs = [
		Ms,
		ks,
		Ts
	], Qs = (e) => Zs.find((t) => t.test(e)), $s = (e) => `'${e}' is not an animatable color. Use the equivalent color code instead.`, ec = (e, t) => {
		let n = Qs(e), r = Qs(t);
		ts(!!n, $s(e)), ts(!!r, $s(t));
		let i = n.parse(e), a = r.parse(t);
		n === Ts && (i = Js(i), n = ks), r === Ts && (a = Js(a), r = ks);
		let o = Object.assign({}, i);
		return (e) => {
			for (let t in o) t !== "alpha" && (o[t] = Xs(i[t], a[t], e));
			return o.alpha = ss(i.alpha, a.alpha, e), n.transform(o);
		};
	};
})), nc, rc = t((() => {
	nc = (e) => typeof e == "number";
})), ic, ac, oc = t((() => {
	ic = (e, t) => (n) => t(e(n)), ac = (...e) => e.reduce(ic);
}));
//#endregion
//#region node_modules/popmotion/dist/es/utils/mix-complex.mjs
function sc(e, t) {
	return nc(e) ? (n) => ss(e, t, n) : Ps.test(e) ? ec(e, t) : dc(e, t);
}
function cc(e) {
	let t = Ws.parse(e), n = t.length, r = 0, i = 0, a = 0;
	for (let e = 0; e < n; e++) r || typeof t[e] == "number" ? r++ : t[e].hue === void 0 ? i++ : a++;
	return {
		parsed: t,
		numNumbers: r,
		numRGB: i,
		numHSL: a
	};
}
var lc, uc, dc, fc = t((() => {
	Ks(), cs(), tc(), rc(), oc(), ns(), lc = (e, t) => {
		let n = [...e], r = n.length, i = e.map((e, n) => sc(e, t[n]));
		return (e) => {
			for (let t = 0; t < r; t++) n[t] = i[t](e);
			return n;
		};
	}, uc = (e, t) => {
		let n = Object.assign(Object.assign({}, e), t), r = {};
		for (let i in n) e[i] !== void 0 && t[i] !== void 0 && (r[i] = sc(e[i], t[i]));
		return (e) => {
			for (let t in r) n[t] = r[t](e);
			return n;
		};
	}, dc = (e, t) => {
		let n = Ws.createTransformer(t), r = cc(e), i = cc(t);
		return r.numHSL === i.numHSL && r.numRGB === i.numRGB && r.numNumbers >= i.numNumbers ? ac(lc(r.parsed, i.parsed), n) : (es(!0, `Complex values '${e}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`), (n) => `${n > 0 ? t : e}`);
	};
}));
//#endregion
//#region node_modules/popmotion/dist/es/utils/interpolate.mjs
function pc(e) {
	if (typeof e == "number") return vc;
	if (typeof e == "string") return Ps.test(e) ? ec : dc;
	if (Array.isArray(e)) return lc;
	if (typeof e == "object") return uc;
}
function mc(e, t, n) {
	let r = [], i = n || pc(e[0]), a = e.length - 1;
	for (let n = 0; n < a; n++) {
		let a = i(e[n], e[n + 1]);
		t && (a = ac(Array.isArray(t) ? t[n] : t, a)), r.push(a);
	}
	return r;
}
function hc([e, t], [n]) {
	return (r) => n(as(e, t, r));
}
function gc(e, t) {
	let n = e.length, r = n - 1;
	return (i) => {
		let a = 0, o = !1;
		if (i <= e[0] ? o = !0 : i >= e[r] && (a = r - 1, o = !0), !o) {
			let t = 1;
			for (; t < n && !(e[t] > i || t === r); t++);
			a = t - 1;
		}
		let s = as(e[a], e[a + 1], i);
		return t[a](s);
	};
}
function _c(e, t, { clamp: n = !0, ease: r, mixer: i } = {}) {
	let a = e.length;
	ts(a === t.length, "Both input and output ranges must be the same length"), ts(!r || !Array.isArray(r) || r.length === a - 1, "Array of easing functions must be of length `input.length - 1`, as it applies to the transitions **between** the defined values."), e[0] > e[a - 1] && (e = [].concat(e), t = [].concat(t), e.reverse(), t.reverse());
	let o = mc(t, r, i), s = a === 2 ? hc(e, o) : gc(e, o);
	return n ? (t) => s(rs(e[0], e[a - 1], t)) : s;
}
var vc, yc = t((() => {
	os(), cs(), tc(), fc(), Ks(), is(), oc(), ns(), vc = (e, t) => (n) => ss(e, t, n);
})), bc = t((() => {
	ns(), is(), yc(), rc(), tc(), fc(), cs(), oc(), os();
}));
//#endregion
//#region src/components/Dock/magnification.ts
function xc(e, t) {
	let n = 0;
	for (let r = 0; r <= Math.max(0, e - 1) * t; r += Q / 8) {
		let i = 0;
		for (let n = 0; n < e; n++) i += Cc(r - n * t) - Q;
		n = Math.max(n, i);
	}
	return n * 1.15;
}
var Q, Sc, Cc, wc = t((() => {
	bc(), Q = 57.6, Sc = Q * 6, Cc = _c([
		-345.6,
		-345.6 / 1.25,
		-345.6 / 2,
		0,
		Sc / 2,
		Sc / 1.25,
		Sc
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
function Tc(e) {
	return e;
}
function Ec(e) {
	return -.5 * (Math.cos(Math.PI * e) - 1);
}
var Dc = t((() => {})), Oc = t((() => {
	Y(), L(), ot(), W();
})), kc = t((() => {
	L(), ot(), W();
})), Ac = t((() => {
	L(), ot(), W();
})), jc = t((() => {
	L(), ot(), W(), Mc();
})), Mc = t((() => {
	L(), ot(), W(), jc();
})), Nc = t((() => {
	Oi();
})), Pc = t((() => {
	Vt();
})), Fc = t((() => {
	Nc(), Pc();
})), Ic = t((() => {
	Oc(), kc(), Ac(), Mc(), jc(), Fc(), Vt();
}));
//#endregion
//#region node_modules/svelte/src/motion/utils.js
function Lc(e) {
	return Object.prototype.toString.call(e) === "[object Date]";
}
var Rc = t((() => {}));
//#endregion
//#region node_modules/svelte/src/motion/spring.js
function zc(e, t, n, r) {
	if (typeof n == "number" || Lc(n)) {
		let i = r - n, a = (n - t) / (e.dt || 1 / 60), o = (a + (e.opts.stiffness * i - e.opts.damping * a) * e.inv_mass) * e.dt;
		return Math.abs(o) < e.opts.precision && Math.abs(i) < e.opts.precision ? r : (e.settled = !1, Lc(n) ? new Date(n.getTime() + o) : n + o);
	} else if (Array.isArray(n)) return n.map((i, a) => zc(e, t[a], n[a], r[a]));
	else if (typeof n == "object") {
		let i = {};
		for (let a in n) i[a] = zc(e, t[a], n[a], r[a]);
		return i;
	} else throw Error(`Cannot spring ${typeof n} values`);
}
function Bc(e, t = {}) {
	let n = Ot(e), { stiffness: r = .15, damping: i = .8, precision: a = .01 } = t, o, s, c, l = e, u = e, d = 1, f = 0, p = !1;
	function m(t, r = {}) {
		u = t;
		let i = c = {};
		return e == null || r.hard || h.stiffness >= 1 && h.damping >= 1 ? (p = !0, o = Sa.now(), l = t, n.set(e = u), Promise.resolve()) : (r.soft && (f = 1 / ((r.soft === !0 ? .5 : +r.soft) * 60), d = 0), s ||= (o = Sa.now(), p = !1, Ta((t) => {
			if (p) return p = !1, s = null, !1;
			d = Math.min(d + f, 1);
			let r = Math.min(t - o, 1e3 / 30), i = {
				inv_mass: d,
				opts: h,
				settled: !0,
				dt: r * 60 / 1e3
			}, a = zc(i, l, e, u);
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
var Vc = t((() => {
	jt(), Ea(), Ca(), Rc(), L(), B(), ot(), W(), x();
}));
//#endregion
//#region node_modules/svelte/src/motion/tweened.js
function Hc(e, t) {
	if (e === t || e !== e) return () => e;
	let n = typeof e;
	if (n !== typeof t || Array.isArray(e) !== Array.isArray(t)) throw Error("Cannot interpolate values of different type");
	if (Array.isArray(e)) {
		let n = t.map((t, n) => Hc(e[n], t));
		return (e) => n.map((t) => t(e));
	}
	if (n === "object") {
		if (!e || !t) throw Error("Object cannot be null");
		if (Lc(e) && Lc(t)) {
			let n = e.getTime(), r = t.getTime() - n;
			return (e) => new Date(n + e * r);
		}
		let n = Object.keys(t), r = {};
		return n.forEach((n) => {
			r[n] = Hc(e[n], t[n]);
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
function Uc(e, t = {}) {
	let n = Ot(e), r, i = e;
	function a(a, o) {
		if (i = a, e == null) return n.set(e = a), Promise.resolve();
		let s = r, c = !1, { delay: l = 0, duration: u = 400, easing: d = Tc, interpolate: f = Hc } = {
			...t,
			...o
		};
		if (u === 0) return s &&= (s.abort(), null), n.set(e = i), Promise.resolve();
		let p = Sa.now() + l, m;
		return r = Ta((t) => {
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
var Wc = t((() => {
	jt(), Ca(), Ea(), Dc(), Rc(), L(), ot(), Y();
})), Gc = t((() => {
	Ic(), Vc(), Wc();
})), $, Kc = t((() => {
	Y(), $o(), $ = Bn({
		open: Object.fromEntries(Xo.map((e) => [e.id, !1])),
		exiting: {},
		minimized: {},
		active: "",
		active_z_index: 0,
		z_indices: Object.fromEntries(Xo.map((e) => [e.id, 0])),
		is_being_dragged: !1,
		fullscreen: {}
	});
})), qc = t((() => {}));
//#endregion
//#region src/portfolio/window-motion.ts
function Jc() {
	return nl.size || (rl = 0), String(1e6 + ++rl);
}
function Yc(e) {
	delete e.dataset.windowMotion, e.style.removeProperty("--window-motion-z-index");
}
function Xc(e) {
	let t = nl.get(e);
	if (!t) return;
	let n = getComputedStyle(t.visual), r = {
		transform: n.transform,
		opacity: n.opacity,
		genie: t.progress?.(),
		geometry: t.geometry
	};
	return nl.delete(e), t.animations.forEach((e) => e.cancel()), t.cleanup(), Yc(t.window), r;
}
function Zc(e) {
	for (let [t, n] of nl) (!e || e === t) && n.animations.forEach((e) => e.finish());
}
function Qc(e, t, n) {
	let r = document.querySelector(`[data-dock="${e}"]`), i = r || n;
	if (!i?.isConnected || !i.getClientRects().length) return {
		x: t.left + t.width / 2,
		y: t.top + t.height * .8,
		width: 58,
		height: 38
	};
	let a = i.getBoundingClientRect(), o = (r?.closest(".mac-dock-viewport"))?.getBoundingClientRect(), s = Math.min(a.width, 58), c = Math.min(a.height, 58), l = r?.querySelector(".mac-dock-icon"), u = r?.querySelector(".mac-dock-dot"), d = l ? a.bottom - (u?.offsetHeight || 0) - (u && parseFloat(getComputedStyle(u).marginTop) || 0) - l.offsetHeight / 2 : a.top + a.height / 2;
	return {
		x: il(a.left + a.width / 2, Math.max(8, o?.left ?? 8) + s / 2, Math.min(innerWidth - 8, o?.right ?? innerWidth - 8) - s / 2),
		y: il(d, 36 + c / 2, innerHeight - c / 2 - 8),
		width: s,
		height: c
	};
}
function $c(e, t) {
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
function el(e, t, n, r, i, a, o) {
	let s = a?.geometry?.rect || r.getBoundingClientRect(), c = a?.geometry?.target || {
		...Qc(e, s, o),
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
	let { copy: d, scrolls: f } = $c(n, s), p = (e) => s.height * (e / 16) ** 1.3, m = a?.genie ?? +(t === "restoring"), h = t === "restoring" ? 0 : 1, g = Math.max(180, 520 * Math.abs(h - m)), _ = (e) => t === "minimizing" ? e : al(e), v = [], y = [d, ...d.querySelectorAll("*")], b = f.map((e) => ({
		...e,
		index: y.indexOf(e.node)
	})), x = document.createDocumentFragment(), S = c.y < s.top + s.height / 2, C = (e, t) => {
		let n = ol(t / .32), r = ol((t - .27) / .73), i = c.width + s.width * .04 * (1 - ol((t - .78) / .22)), a = il(S ? 1 - e : e), o = 1 - ol(a), l = 1 - r, u = i + (i + (s.width - i) * ol(l) - i) * o, d = s.left + s.width / 2, f = d + (c.x - d) * r, p = c.x + (f - c.x) * o, m = S ? -1 : 1, h = S ? s.bottom : s.top, g = c.y - m * i / 2, _ = h + (g - h) * r, v = _ + a * (g - _ + m * i), y = s.width + (u - s.width) * n, b = d + (p - d) * n, x = s.top + e * s.height + (v - s.top - e * s.height) * n;
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
				opacity: String(1 - ol((t - .84) / .16))
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
		progress: () => m + (h - m) * _(il(Number(v[0].currentTime || 0) / g)),
		cleanup: () => {
			u.remove(), n.style.opacity = w, n.style.pointerEvents = ee;
		}
	};
}
async function tl(e, t, n, r) {
	let i = document.getElementById(`mac-window-${e}`), a = i?.querySelector(".mac-window-visual");
	if (!i || !a || X.reduced || !a.animate) return;
	let o = Jc(), s;
	if (t === "minimizing" || t === "restoring" || t === "opening" && n?.genie !== void 0) s = el(e, t === "opening" ? "restoring" : t, a, i, o, n, r);
	else {
		let o = i.getBoundingClientRect(), c = Qc(e, o, r), l = {
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
	nl.set(e, s), i.style.setProperty("--window-motion-z-index", o), i.dataset.windowMotion = t;
	try {
		await Promise.all(s.animations.map((e) => e.finished));
	} catch {} finally {
		nl.get(e) === s && (nl.delete(e), s.animations.forEach((e) => e.cancel()), s.cleanup(), Yc(i), i.dispatchEvent(new CustomEvent("window-motion-settled")));
	}
}
var nl, rl, il, al, ol, sl = t((() => {
	Lo(), qc(), nl = /* @__PURE__ */ new Map(), rl = 0, il = (e, t = 0, n = 1) => Math.min(n, Math.max(t, e)), al = (e) => e - Math.sin(2 * Math.PI * e) / (2 * Math.PI), ol = (e) => {
		let t = il(e);
		return t * t * (3 - 2 * t);
	};
}));
//#endregion
//#region src/portfolio/actions.ts
function cl(e) {
	let t = (yl.get(e) || 0) + 1;
	return yl.set(e, t), {
		version: t,
		frame: Xc(e)
	};
}
function ll(e, t) {
	Xr().then(() => {
		t === bl && e()?.focus({ preventScroll: !0 });
	});
}
function ul(e) {
	history.pushState(null, "", `${location.pathname}${location.search}${e ? `#${e}` : ""}`);
}
function dl(e) {
	$.active = e, $.active_z_index > 1e4 && (Object.keys($.z_indices).sort((e, t) => $.z_indices[e] - $.z_indices[t]).forEach((e, t) => $.z_indices[e] = t + 1), $.active_z_index = Xo.length), $.z_indices[e] = ++$.active_z_index;
}
async function fl(e, t = !0) {
	if (!Qo[e]) return;
	let n = !!$.minimized[e], r = !$.open[e] || n || $.exiting[e], { version: i, frame: a } = cl(e), o = document.getElementById(`mac-window-${e}`);
	document.activeElement instanceof HTMLElement && document.activeElement !== document.body && !o?.contains(document.activeElement) && vl.set(e, document.activeElement), $.exiting[e] = !1, $.open[e] = !0, $.minimized[e] = !1, dl(e);
	let s = ++bl;
	t && location.hash !== `#${Qo[e].hash}` && ul(Qo[e].hash), ll(() => document.querySelector(`#mac-window-${e} [data-window-action='close']`), s), await Xr(), yl.get(e) === i && (r || a) && await tl(e, n ? "restoring" : "opening", a, vl.get(e));
}
function pl(e) {
	document.querySelectorAll(`#mac-window-${e} video`).forEach((e) => e.pause());
}
async function ml(e, t = !1) {
	if (!$.open[e] || $.minimized[e]) return;
	let { version: n, frame: r } = cl(e);
	pl(e), $.exiting[e] = !0;
	let i = ++bl, a = Xo.filter((e) => $.open[e.id] && !$.minimized[e.id] && !$.exiting[e.id]).sort((e, t) => $.z_indices[t.id] - $.z_indices[e.id])[0];
	a ? (dl(a.id), ul(a.hash)) : ($.active = "", ul("")), ll(() => a ? document.querySelector(`#mac-window-${a.id} [data-window-action='close']`) : vl.get(e), i), await tl(e, t ? "minimizing" : "closing", r, vl.get(e)), yl.get(e) === n && (t ? $.minimized[e] = !0 : ($.open[e] = !1, $.fullscreen[e] = !1), $.exiting[e] = !1);
}
function hl(e = !0) {
	++bl;
	for (let e of Xo) cl(e.id), pl(e.id), $.exiting[e.id] = !1, $.open[e.id] && ($.minimized[e.id] = !0);
	$.active = "", e && ul("");
}
function gl() {
	let e = "";
	try {
		e = decodeURIComponent(location.hash.slice(1));
	} catch {
		return;
	}
	let t = document.getElementById(e), n = Xo.find((n) => n.hash === e || t?.closest(`#mac-window-${n.id}`));
	n ? fl(n.id, !1) : (!e || e === "top") && hl(!1);
}
function _l(e, t) {
	let n = Qo[t], r = n.content || document.getElementById(n.hash);
	return e.append(r), r.querySelectorAll(".is-pending").forEach((e) => e.classList.remove("is-pending")), { destroy() {
		document.getElementById("main-content")?.append(r);
	} };
}
var vl, yl, bl, xl = t((() => {
	Mo(), sl(), Kc(), $o(), vl = /* @__PURE__ */ new Map(), yl = /* @__PURE__ */ new Map(), bl = 0;
})), Sl = t((() => {}));
//#endregion
//#region src/components/Dock/DockItem.svelte
function Cl(e, t) {
	lt(t, !0);
	let n = () => Mt(c, "$appOpenIconBounceTransform", i), r = () => Mt(s, "$width_px", i), [i, a] = Nt(), o = /* @__PURE__ */ F(void 0), s = Bc(Q, {
		damping: .47,
		stiffness: .12
	});
	fr(() => {
		let e = t.mouse_x, n = V(o), r = t.magnification;
		if (X.reduced || X.compact || X.scrollable || $.is_being_dragged) {
			$r(() => s.set(Q, { hard: !0 }));
			return;
		}
		let i = requestAnimationFrame(() => {
			let t = n?.getBoundingClientRect(), i = e !== null && t ? Q + (Cc(e - t.left - t.width / 2) - Q) * r : Q;
			s.set(i);
		});
		return () => cancelAnimationFrame(i);
	});
	let c = Uc(0, {
		duration: 400,
		easing: Ec
	});
	async function l() {
		if (t.app_id === "github") {
			window.open("https://github.com/Jason-chen-coder", "_blank", "noopener,noreferrer");
			return;
		}
		let e = $.open[t.app_id];
		fl(t.app_id), !e && !X.reduced && (await c.set(-28), c.set(0));
	}
	var u = wl(), d = R(u);
	let f, p;
	var m = R(d, !0);
	D(d);
	var h = z(d, 2);
	let g;
	var _ = R(h);
	let v;
	ha(_, () => Go[t.app_id], !0), D(_), ho(_, (e) => I(o, e), () => V(o)), D(h);
	var y = z(h, 2);
	let b;
	D(u), br((e, i) => {
		J(u, "aria-label", e), J(u, "aria-expanded", t.app_id === "github" ? void 0 : !!$.open[t.app_id] && !$.minimized[t.app_id]), J(u, "aria-controls", t.app_id === "github" ? void 0 : `mac-window-${t.app_id}`), qa(u, 1, `dock-open-app-button mac-dock-item ${t.app_id ?? ""}`, "s-1lja36i"), J(u, "data-dock", t.app_id), J(u, "data-app-open", t.app_id), f = qa(d, 1, "tooltip mac-dock-tooltip s-1lja36i", null, f, { "tooltip-enabled": !$.is_being_dragged }), p = Xa(d, "", p, { transform: `translate(0, ${n() ?? ""}px)` }), q(m, i), g = Xa(h, "", g, { transform: `translate(0, ${n() ?? ""}px)` }), v = Xa(_, "", v, { width: `${(X.compact ? 44 : r()) ?? ""}px` }), b = Xa(y, "", b, { "--opacity": +!!$.open[t.app_id] });
	}, [() => Z(t.app_id), () => Z(t.app_id)]), G("click", u, l), K(e, u), ut(), a();
}
var wl, Tl = t((() => {
	Po(), Y(), Mo(), wc(), Dc(), Gc(), Kc(), Lo(), $o(), xl(), Sl(), wl = /* @__PURE__ */ Pi("<button><p> </p> <span class=\"s-1lja36i\"><span class=\"mac-dock-icon s-1lja36i\"></span></span> <div class=\"dot mac-dock-dot s-1lja36i\"></div></button>"), Si(["click"]);
})), El = t((() => {}));
//#endregion
//#region src/components/Dock/Dock.svelte
function Dl(e, t) {
	lt(t, !0);
	let n = /* @__PURE__ */ F(null), r, i, a, o = /* @__PURE__ */ F(0);
	function s() {
		if (!a || !i) return;
		let e = (e) => parseFloat(e) || 0, t = getComputedStyle(i), n = e(t.paddingLeft) + e(t.paddingRight) + e(t.borderLeftWidth) + e(t.borderRightWidth), r = 0, s = Infinity;
		for (let t of i.children) {
			let i = getComputedStyle(t), a = e(i.paddingLeft) + e(i.paddingRight) + e(i.borderLeftWidth) + e(i.borderRightWidth) + e(i.marginLeft) + e(i.marginRight);
			t.matches("[data-dock]") ? (n += (X.compact ? 44 : Q) + a, r++, s = Math.min(s, a)) : n += e(i.width) + e(i.marginLeft) + e(i.marginRight);
		}
		let c = Math.max(0, a.clientWidth - 24);
		X.scrollable = n > c + 1, I(o, X.compact || X.scrollable ? 0 : Math.min(1, Math.max(0, c - n - 2) / xc(r, Q + (Number.isFinite(s) ? s : 0))), !0);
	}
	ko(() => {
		let e = new ResizeObserver(s);
		return e.observe(a), s(), () => e.disconnect();
	}), fr(() => {
		X.compact, s();
	});
	function c(e) {
		X.scrollable && Math.abs(e.deltaY) > Math.abs(e.deltaX) && (e.preventDefault(), r.scrollLeft += e.deltaY);
	}
	var l = Al();
	let u;
	var d = R(l), f = R(d);
	let p;
	sa(f, 21, () => Zo, ia, (e, t) => {
		var r = kl(), i = qn(r), a = (e) => {
			K(e, Ol());
		};
		ea(i, (e) => {
			V(t).id === "github" && e(a);
		}), Cl(z(i, 2), {
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
	}), D(f), ho(f, (e) => i = e, () => i), D(d), ho(d, (e) => r = e, () => r);
	var m = z(d, 2), h = R(m, !0);
	D(m), D(l), ho(l, (e) => a = e, () => a), br((e, t) => {
		u = qa(l, 1, "dock-container mac-dock-region s-v5b3pc", null, u, { "is-scrollable": X.scrollable }), J(f, "aria-label", e), p = Xa(f, "", p, { "--dock-rest-size": `${Q}px` }), q(h, t);
	}, [() => Z("navigation"), () => Z("dockScroll")]), xi("wheel", d, c), G("pointermove", f, (e) => I(n, e.pointerType === "touch" ? null : e.clientX, !0)), xi("pointerleave", f, () => I(n, null)), G("focusin", f, (e) => {
		X.scrollable && e.target.closest("button")?.scrollIntoView({
			block: "nearest",
			inline: "nearest"
		});
	}), K(e, l), ut();
}
var Ol, kl, Al, jl = t((() => {
	Po(), Y(), Mo(), $o(), Lo(), Tl(), wc(), El(), Ol = /* @__PURE__ */ Pi("<div class=\"divider s-v5b3pc\" aria-hidden=\"true\"></div>"), kl = /* @__PURE__ */ Pi("<!> <!>", 1), Al = /* @__PURE__ */ Pi("<section><div class=\"mac-dock-viewport s-v5b3pc\"><nav class=\"dock-el mac-dock s-v5b3pc\"></nav></div> <p class=\"dock-scroll-hint s-v5b3pc\"> </p></section>"), Si(["pointermove", "focusin"]);
}));
//#endregion
//#region node_modules/svelte/src/transition/index.js
function Ml(e) {
	let t = e - 1;
	return t * t * t + 1;
}
function Nl(e) {
	let t = typeof e == "string" && e.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
	return t ? [parseFloat(t[1]), t[2] || "px"] : [e, "px"];
}
function Pl(e, { delay: t = 0, duration: n = 400, easing: r = Ml, x: i = 0, y: a = 0, opacity: o = 0 } = {}) {
	let s = getComputedStyle(e), c = +s.opacity, l = s.transform === "none" ? "" : s.transform, u = c * (1 - o), [d, f] = Nl(i), [p, m] = Nl(a);
	return {
		delay: t,
		duration: n,
		easing: r,
		css: (e, t) => `
			transform: ${l} translate(${(1 - e) * d}${f}, ${(1 - e) * p}${m});
			opacity: ${c - u * t}`
	};
}
var Fl = t((() => {}));
//#endregion
//#region src/components/Desktop/wallpaper/preferences.svelte.ts
function Il() {
	try {
		let e = localStorage.getItem(zl);
		if (Rl.some((t) => t.id === e)) return e;
	} catch {}
	return "fold";
}
function Ll(e) {
	Bl.current = e;
	try {
		localStorage.setItem(zl, e);
	} catch {}
}
var Rl, zl, Bl, Vl = t((() => {
	Y(), Rl = [
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
	], zl = "portfolio-wallpaper", Bl = Bn({ current: Il() });
}));
//#endregion
//#region src/components/Desktop/ThemeSwitch.svelte
function Hl(e, t) {
	lt(t, !0);
	let n = So(t, "embedded", 3, !1), r = window.PortfolioTheme, i = /* @__PURE__ */ F(Bn(r.preference)), a, o, s = [
		"light",
		"dark",
		"system"
	], c = /* @__PURE__ */ $t(() => X.locale === "en" ? {
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
	async function l(e, t) {
		let i = o.getBoundingClientRect(), s = t.detail ? {
			x: t.clientX,
			y: t.clientY
		} : {
			x: i.x + i.width / 2,
			y: i.y + i.height / 2
		};
		n() || (a.open = !1, o.focus()), await Xr(), r.set(e, s);
	}
	ko(() => {
		let e = () => I(i, r.preference, !0), t = (e) => {
			a.contains(e.target) || (a.open = !1);
		}, s = (e) => {
			e.key === "Escape" && a.open && (e.preventDefault(), e.stopImmediatePropagation(), a.open = !1, o.focus());
		};
		return document.addEventListener("portfolio:themechange", e), n() ? () => document.removeEventListener("portfolio:themechange", e) : (document.addEventListener("pointerdown", t), document.addEventListener("keydown", s, !0), () => {
			document.removeEventListener("portfolio:themechange", e), document.removeEventListener("pointerdown", t), document.removeEventListener("keydown", s, !0);
		});
	});
	var u = ql();
	let d;
	var f = R(u), p = R(f), m = R(p), h = (e) => {
		var t = Ul();
		Je(), K(e, t);
	}, g = (e) => {
		K(e, Wl());
	}, _ = (e) => {
		var t = Gl();
		Je(), K(e, t);
	};
	ea(m, (e) => {
		V(i) === "system" ? e(h) : V(i) === "dark" ? e(g, 1) : e(_, -1);
	}), D(p);
	var v = z(p), y = R(v, !0);
	D(v), D(f), ho(f, (e) => o = e, () => o);
	var b = z(f, 2), x = R(b), S = R(x, !0);
	D(x);
	var C = z(x, 2);
	sa(C, 17, () => s, ia, (e, t) => {
		var n = Kl(), r = R(n), a = z(r), o = R(a, !0);
		D(a);
		var s = z(a), u = R(s, !0);
		D(s), D(n), br(() => {
			J(n, "data-theme-option", V(t)), J(n, "aria-pressed", V(i) === V(t)), qa(r, 1, `mac-theme-swatch ${V(t) ?? ""}`), q(o, V(c)[V(t)]), q(u, V(i) === V(t) ? "✓" : "");
		}), G("click", n, (e) => l(V(t), e)), K(e, n);
	});
	var w = z(C, 2), ee = R(w, !0);
	D(w), D(b), D(u), ho(u, (e) => a = e, () => a), br(() => {
		d = qa(u, 1, "mac-theme", null, d, { embedded: n() }), u.open = n(), J(f, "aria-label", `${V(c).title}: ${V(c)[V(i)]}`), J(f, "title", V(c).title), q(y, V(c).title), J(b, "aria-label", V(c).title), q(S, V(c).title), q(ee, V(c).hint);
	}), K(e, u), ut();
}
var Ul, Wl, Gl, Kl, ql, Jl = t((() => {
	Po(), Y(), Mo(), Lo(), Ul = /* @__PURE__ */ Ii("<rect x=\"3\" y=\"4\" width=\"18\" height=\"13\" rx=\"2\"></rect><path d=\"M8 21h8m-4-4v4\"></path>", 1), Wl = /* @__PURE__ */ Ii("<path d=\"M20.5 13.1A8.5 8.5 0 0 1 10.9 3.5a8.5 8.5 0 1 0 9.6 9.6Z\"></path>"), Gl = /* @__PURE__ */ Ii("<circle cx=\"12\" cy=\"12\" r=\"4\"></circle><path d=\"M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5\"></path>", 1), Kl = /* @__PURE__ */ Pi("<button type=\"button\"><span aria-hidden=\"true\"></span><span> </span><span class=\"mac-theme-check\" aria-hidden=\"true\"> </span></button>"), ql = /* @__PURE__ */ Pi("<details><summary data-theme-toggle=\"\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><!></svg><span class=\"mac-theme-label\"> </span></summary> <div class=\"mac-theme-panel\" role=\"group\"><p class=\"mac-theme-heading\"> </p> <!> <p class=\"mac-theme-hint\"> </p></div></details>"), Si(["click"]);
})), Yl = t((() => {}));
//#endregion
//#region src/components/Desktop/WallpaperSwitch.svelte
function Xl(e, t) {
	lt(t, !0);
	let n = So(t, "embedded", 3, !1), r, i, a = /* @__PURE__ */ $t(() => X.locale === "en" ? "Wallpaper" : "壁纸"), o = /* @__PURE__ */ $t(() => Rl.find((e) => e.id === Bl.current));
	function s(e) {
		Ll(e), n() || (r.open = !1, i.focus());
	}
	ko(() => {
		if (n()) return;
		let e = (e) => {
			r.contains(e.target) || (r.open = !1);
		}, t = (e) => {
			e.key === "Escape" && r.open && (e.preventDefault(), e.stopImmediatePropagation(), r.open = !1, i.focus());
		};
		return document.addEventListener("pointerdown", e), document.addEventListener("keydown", t, !0), () => {
			document.removeEventListener("pointerdown", e), document.removeEventListener("keydown", t, !0);
		};
	});
	var c = Ql();
	let l;
	var u = R(c), d = z(R(u)), f = R(d, !0);
	D(d), D(u), ho(u, (e) => i = e, () => i);
	var p = z(u, 2);
	sa(p, 21, () => Rl, ia, (e, t) => {
		var n = Zl(), r = R(n), i = z(r, 2), a = R(i, !0), o = z(a), c = R(o, !0);
		D(o), D(i), D(n), br(() => {
			J(n, "data-wallpaper-option", V(t).id), J(n, "aria-label", X.locale === "en" ? V(t).en : V(t).zh), J(n, "aria-pressed", Bl.current === V(t).id), qa(r, 1, `wallpaper-preview ${V(t).id ?? ""}`, "s-imhxqg"), Xa(r, `--base:${V(t).colors[0]};--mid:${V(t).colors[1]};--light:${V(t).colors[2]}`), q(a, X.locale === "en" ? V(t).en : V(t).zh), q(c, Bl.current === V(t).id ? "✓" : "");
		}), G("click", n, () => s(V(t).id)), K(e, n);
	}), D(p), D(c), ho(c, (e) => r = e, () => r), br(() => {
		l = qa(c, 1, "wallpaper-picker s-imhxqg", null, l, { embedded: n() }), c.open = n(), J(u, "aria-label", `${V(a)}: ${X.locale === "en" ? V(o).en : V(o).zh}`), J(u, "title", V(a)), q(f, V(a)), J(p, "aria-label", V(a));
	}), K(e, c), ut();
}
var Zl, Ql, $l = t((() => {
	Po(), Y(), Mo(), Lo(), Vl(), Yl(), Zl = /* @__PURE__ */ Pi("<button type=\"button\" class=\"s-imhxqg\"><span aria-hidden=\"true\"><span class=\"s-imhxqg\"></span></span> <span class=\"wallpaper-name s-imhxqg\"> <span aria-hidden=\"true\"> </span></span></button>"), Ql = /* @__PURE__ */ Pi("<details><summary data-wallpaper-toggle=\"\" class=\"s-imhxqg\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"4\" width=\"18\" height=\"16\" rx=\"3\"></rect><circle cx=\"9\" cy=\"9\" r=\"1.5\"></circle><path d=\"m4 17 5-5 4 4 3-3 5 5\"></path></svg><span class=\"picker-label s-imhxqg\"> </span></summary> <div class=\"wallpaper-panel s-imhxqg\" role=\"group\"></div></details>"), Si(["click"]);
})), eu = t((() => {}));
//#endregion
//#region src/components/Desktop/ControlCenter.svelte
function tu(e, t) {
	lt(t, !0);
	let n, r, i = /* @__PURE__ */ F(void 0), a = /* @__PURE__ */ F(!1), o = /* @__PURE__ */ F("home"), s = /* @__PURE__ */ $t(() => X.locale === "en" ? {
		title: "Control Center",
		appearance: "Appearance",
		wallpaper: "Wallpaper",
		language: "Language",
		back: "Back",
		light: "Light",
		dark: "Dark",
		system: "System"
	} : {
		title: "控制中心",
		appearance: "外观",
		wallpaper: "壁纸",
		language: "语言",
		back: "返回",
		light: "浅色",
		dark: "深色",
		system: "跟随系统"
	}), c = /* @__PURE__ */ $t(() => Rl.find((e) => e.id === Bl.current)), l = /* @__PURE__ */ F(Bn(window.PortfolioTheme.preference));
	function u() {
		I(a, !1), r.focus();
	}
	async function d(e) {
		I(o, e, !0), await Xr(), V(i)?.focus();
	}
	async function f() {
		let e = V(o);
		I(o, "home"), await Xr(), n.querySelector(`[data-control="${e}"]`)?.focus();
	}
	function p(e) {
		window.PortfolioI18n.applyLocale(e);
	}
	ko(() => {
		let e = () => I(l, window.PortfolioTheme.preference, !0), t = (e) => {
			n.contains(e.target) || I(a, !1);
		}, r = (e) => {
			e.key === "Escape" && V(a) && (e.preventDefault(), e.stopImmediatePropagation(), V(o) === "home" ? u() : f());
		};
		return document.addEventListener("portfolio:themechange", e), document.addEventListener("pointerdown", t), document.addEventListener("keydown", r, !0), () => {
			document.removeEventListener("portfolio:themechange", e), document.removeEventListener("pointerdown", t), document.removeEventListener("keydown", r, !0);
		};
	});
	var m = ou(), h = R(m);
	ho(h, (e) => r = e, () => r);
	var g = z(h, 2), _ = (e) => {
		var t = au();
		let n;
		var r = R(t), a = (e) => {
			var t = nu(), n = R(t), r = z(R(n)), i = R(r), a = R(i, !0);
			D(i);
			var o = z(i), u = R(o, !0);
			D(o), D(r), Je(), D(n);
			var f = z(n, 2), p = R(f), m = z(p), h = R(m), g = R(h, !0);
			D(h);
			var _ = z(h), v = R(_, !0);
			D(_), D(m), Je(), D(f);
			var y = z(f, 2), b = z(R(y)), x = R(b), S = R(x, !0);
			D(x);
			var C = z(x), w = R(C, !0);
			D(C), D(b), Je(), D(y), D(t), br(() => {
				q(a, V(s).appearance), q(u, V(s)[V(l)]), Xa(p, `--a:${V(c).colors[0]};--b:${V(c).colors[1]};--c:${V(c).colors[2]}`), q(g, V(s).wallpaper), q(v, X.locale === "en" ? V(c).en : V(c).zh), q(S, V(s).language), q(w, X.locale === "en" ? "English" : "简体中文");
			}), G("click", n, () => d("appearance")), G("click", f, () => d("wallpaper")), G("click", y, () => d("language")), K(e, t);
		}, u = (e) => {
			var t = iu(), n = qn(t), r = R(n);
			ho(r, (e) => I(i, e), () => V(i));
			var a = z(r), c = R(a, !0);
			D(a), D(n);
			var l = z(n, 2), u = R(l), d = (e) => {
				Hl(e, { embedded: !0 });
			}, m = (e) => {
				Xl(e, { embedded: !0 });
			}, h = (e) => {
				var t = ru(), n = R(t), r = z(R(n)), i = R(r, !0);
				D(r), D(n);
				var a = z(n), o = z(R(a)), c = R(o, !0);
				D(o), D(a), D(t), br(() => {
					J(t, "aria-label", V(s).language), J(n, "aria-pressed", X.locale === "zh-CN"), q(i, X.locale === "zh-CN" ? "✓" : ""), J(a, "aria-pressed", X.locale === "en"), q(c, X.locale === "en" ? "✓" : "");
				}), G("click", n, () => p("zh-CN")), G("click", a, () => p("en")), K(e, t);
			};
			ea(u, (e) => {
				V(o) === "appearance" ? e(d) : V(o) === "wallpaper" ? e(m, 1) : e(h, -1);
			}), D(l), br(() => {
				J(r, "aria-label", V(s).back), q(c, V(s)[V(o)]);
			}), G("click", r, f), Aa(1, l, () => Pl, () => ({
				x: 8,
				duration: X.reduced ? 0 : 160
			})), K(e, t);
		};
		ea(r, (e) => {
			V(o) === "home" ? e(a) : e(u, -1);
		}), D(t), br(() => {
			n = qa(t, 1, "control-panel s-1xsnj7j", null, n, { detail: V(o) !== "home" }), J(t, "aria-label", V(s).title);
		}), Aa(3, t, () => Pl, () => ({
			y: -8,
			duration: X.reduced ? 0 : 180
		})), K(e, t);
	};
	ea(g, (e) => {
		V(a) && e(_);
	}), D(m), ho(m, (e) => n = e, () => n), br(() => {
		J(h, "aria-label", V(s).title), J(h, "title", V(s).title), J(h, "aria-expanded", V(a));
	}), G("click", h, () => {
		V(a) ? u() : (I(o, "home"), I(a, !0));
	}), K(e, m), ut();
}
var nu, ru, iu, au, ou, su = t((() => {
	Po(), Y(), Mo(), Fl(), Lo(), Vl(), Jl(), $l(), eu(), nu = /* @__PURE__ */ Pi("<div class=\"control-grid s-1xsnj7j\"><button class=\"control-card appearance s-1xsnj7j\" data-control=\"appearance\"><span class=\"round-icon s-1xsnj7j\" aria-hidden=\"true\">◐</span><span class=\"card-copy s-1xsnj7j\"><strong class=\"s-1xsnj7j\"> </strong><small class=\"s-1xsnj7j\"> </small></span><span class=\"chevron s-1xsnj7j\" aria-hidden=\"true\">›</span></button> <button class=\"control-card wallpaper s-1xsnj7j\" data-control=\"wallpaper\"><span class=\"wallpaper-thumb s-1xsnj7j\" aria-hidden=\"true\"></span><span class=\"card-copy s-1xsnj7j\"><strong class=\"s-1xsnj7j\"> </strong><small class=\"s-1xsnj7j\"> </small></span><span class=\"chevron s-1xsnj7j\" aria-hidden=\"true\">›</span></button> <button class=\"control-card language s-1xsnj7j\" data-control=\"language\"><span class=\"round-icon blue s-1xsnj7j\" aria-hidden=\"true\">文</span><span class=\"card-copy s-1xsnj7j\"><strong class=\"s-1xsnj7j\"> </strong><small class=\"s-1xsnj7j\"> </small></span><span class=\"chevron s-1xsnj7j\" aria-hidden=\"true\">›</span></button></div>"), ru = /* @__PURE__ */ Pi("<div class=\"language-options s-1xsnj7j\"><button data-desktop-locale=\"zh-CN\" class=\"s-1xsnj7j\">简体中文 <span class=\"s-1xsnj7j\"> </span></button><button data-desktop-locale=\"en\" class=\"s-1xsnj7j\">English <span class=\"s-1xsnj7j\"> </span></button></div>"), iu = /* @__PURE__ */ Pi("<header class=\"detail-header s-1xsnj7j\"><button class=\"back s-1xsnj7j\"><svg width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m14 6-6 6 6 6\"></path></svg></button><strong class=\"s-1xsnj7j\"> </strong></header> <div class=\"detail-content s-1xsnj7j\"><!></div>", 1), au = /* @__PURE__ */ Pi("<div id=\"control-panel\" role=\"group\"><!></div>"), ou = /* @__PURE__ */ Pi("<div class=\"control-center s-1xsnj7j\"><button class=\"control-trigger s-1xsnj7j\" aria-controls=\"control-panel\" data-settings-toggle=\"\"><svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M7 3h12a4 4 0 0 1 0 8H7a4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5 13h12a4 4 0 0 1 0 8H5a4 4 0 0 1 0-8Zm12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z\"></path></svg></button> <!></div>"), Si(["click"]);
})), cu = t((() => {
	it(), tt();
}));
//#endregion
//#region node_modules/@neodrag/core/dist/chunk-4ZITEWYV.js
function lu(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function uu(e, t, n) {
	e.style.setProperty(t.toString(), n?.toString() ?? "");
}
function du(e, t) {
	return e.style.getPropertyValue(t.toString());
}
function fu(e, t, n) {
	e.setAttribute(`data-${t}`, n + "");
}
function pu(e) {
	return e instanceof SVGElement;
}
function mu(e) {
	return e instanceof SVGSVGElement;
}
function hu(e) {
	return e;
}
function gu(e, t) {
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
		} else uu(e.rootNode, "translate", `${e.offset.x}px ${e.offset.y}px 0.000000001px`);
	});
}
function _u(e, t, n) {
	if (e[1][0] - e[0][0] < t || e[1][1] - e[0][1] < n) throw Error("Bounds dimensions cannot be smaller than the draggable element dimensions");
}
function vu(e, t) {
	return e.area < t.area && e.left >= t.left && e.right <= t.right && e.top >= t.top && e.bottom <= t.bottom;
}
function yu(e, t, n) {
	return n.filter((n) => bu(t.clientX, t.clientY, n, e.cachedRootNodeRect)).sort((e, t) => e.area - t.area);
}
function bu(e, t, n, r) {
	let i = e - r.left, a = t - r.top;
	return i >= n.left && i <= n.right && a >= n.top && a <= n.bottom;
}
var xu, Su, Cu, wu, Tu, Eu, Du, Ou, ku, Au, ju, Mu, Nu, Pu, Fu, Iu, Lu = t((() => {
	xu = (e) => Object.is(e, null), Su = class {
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
	}, Cu = hu((e = !0) => ({
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
	})), wu = hu(() => ({
		name: "neodrag:stateMarker",
		cancelable: !1,
		setup(e) {
			return fu(e.rootNode, "neodrag", ""), fu(e.rootNode, "neodrag-state", "idle"), fu(e.rootNode, "neodrag-count", "0"), { count: 0 };
		},
		start(e) {
			e.effect.paint(() => {
				fu(e.rootNode, "neodrag-state", "dragging");
			});
		},
		end(e, t) {
			fu(e.rootNode, "neodrag-state", "idle"), fu(e.rootNode, "neodrag-count", ++t.count);
		}
	})), Tu = hu((e = !0) => ({
		name: "neodrag:applyUserSelectHack",
		cancelable: !1,
		setup() {
			return { body_user_select_val: "" };
		},
		start(t, n) {
			t.effect.paint(() => {
				e && (n.body_user_select_val = du(document.body, "user-select") ?? document.body.style.webkitUserSelect ?? "", uu(document.body, "user-select", "none"), document.body.style.webkitUserSelect = "none");
			});
		},
		end(t, n) {
			e && (uu(document.body, "user-select", n.body_user_select_val), document.body.style.webkitUserSelect = n.body_user_select_val);
		}
	})), Eu = hu((e = !0) => ({
		name: "neodrag:disabled",
		shouldStart() {
			return !e;
		}
	})), Du = hu((e) => ({
		name: "neodrag:transform",
		priority: -1e3,
		cancelable: !1,
		liveUpdate: !0,
		setup(t) {
			gu(t, e);
		},
		drag(t) {
			gu(t, e);
		}
	})), Ou = {
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
				return Ou.element(i, t)(r);
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
			return (t) => Ou.element(t.root_node.parentElement, e)(t);
		}
	}, ku = (e, t, n) => Math.min(n, Math.max(t, e)), Au = hu((e = () => [[0, 0], [0, 0]], t = (e) => e.hook === "start") => ({
		name: "neodrag:bounds",
		setup(n) {
			let r;
			r = t?.({ hook: "setup" }) ? e({ root_node: n.rootNode }) : [[0, 0], [window.innerWidth, window.innerHeight]];
			let i = n.cachedRootNodeRect.width, a = n.cachedRootNodeRect.height;
			return _u(r, i, a), {
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
				_u(t, i, a), r.bounds = t, r.initialElementPosition = {
					x: n.cachedRootNodeRect.left - n.offset.x,
					y: n.cachedRootNodeRect.top - n.offset.y
				};
			}
		},
		drag(n, r) {
			if (!n.isDragging) return;
			if (t?.({ hook: "drag" })) {
				let t = e({ root_node: n.rootNode }), i = n.cachedRootNodeRect.width, a = n.cachedRootNodeRect.height;
				_u(t, i, a), r.bounds = t;
			}
			let i = r.bounds, a = n.cachedRootNodeRect.width, o = n.cachedRootNodeRect.height, s = i[0][0], c = i[0][1], l = i[1][0] - a, u = i[1][1] - o, d = r.initialElementPosition, f = s - d.x, p = c - d.y, m = l - d.x, h = u - d.y, g = n.offset.x + (n.proposed.x ?? 0), _ = n.offset.y + (n.proposed.y ?? 0), v = ku(g, f, m), y = ku(_, p, h), b = v - n.offset.x, x = y - n.offset.y;
			n.propose(n.proposed.x === null ? null : b, n.proposed.y === null ? null : x);
		},
		end(n, r) {
			if (t?.({ hook: "end" })) {
				let t = e({ root_node: n.rootNode }), i = n.cachedRootNodeRect.width, a = n.cachedRootNodeRect.height;
				_u(t, i, a), r.bounds = t;
			}
		}
	})), ju = hu((e) => ({
		name: "neodrag:threshold",
		setup() {
			let t = !xu(e);
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
	})), Mu = hu((e = {}) => ({
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
	})), Nu = {
		selector(e) {
			return (t) => Nu.elements(t.querySelectorAll(e))(t);
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
	}, Pu = hu((e, t = (e) => e.hook === "setup") => ({
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
			let r = yu(e, n, t.allow_zones), i = yu(e, n, t.block_zones);
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
				if (vu(e, t)) {
					a = e, o = !0;
					break;
				}
				if (vu(t, e)) {
					a = t, o = !1;
					break;
				}
				e.area <= t.area ? (a = e, o = !0, s++) : (a = t, o = !1, c++);
			}
			return a ? o ? (e.currentlyDraggedNode = a.element, !0) : !1 : t.allow_zones.length === 0;
		}
	})), Fu = hu((e = null) => ({
		name: "neodrag:position",
		priority: 1e3,
		liveUpdate: !0,
		setup(t) {
			if (!t.isInteracting) {
				let n = e?.current?.x ?? e?.default?.x ?? t.offset.x, r = e?.current?.y ?? e?.default?.y ?? t.offset.y;
				(n !== t.offset.x || r !== t.offset.y) && t.setForcedPosition(n, r);
			}
		}
	})), Iu = hu((e = "none") => ({
		name: "neodrag:touch-action",
		cancelable: !1,
		liveUpdate: !0,
		setup(t) {
			e !== !1 && e !== null && uu(t.rootNode, "touch-action", e ?? "none");
		}
	}));
})), Ru, zu, Bu = t((() => {
	Lu(), Ru = {
		plugins: [
			Cu(),
			wu(),
			Tu(),
			Du(),
			ju(),
			Iu()
		],
		onError: (e) => {
			console.error(e);
		},
		delegate: () => document.documentElement
	}, zu = class {
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
			if (mu(e)) throw Error("Dragging the root SVG element directly is not recommended. Instead, either:\n1. Wrap your SVG in a div and make the div draggable\n2. Use viewBox manipulation if you want to pan the SVG canvas\n3. Or if you really need to transform the SVG element, use CSS transforms");
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
			lu(e, "pointerdown", this.#v.bind(this), {
				passive: !0,
				capture: !1
			}), lu(e, "pointermove", this.#y.bind(this), {
				passive: !1,
				capture: !1
			}), lu(e, "pointerup", this.#b.bind(this), {
				passive: !0,
				capture: !1
			}), lu(e, "pointercancel", this.#b.bind(this), {
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
				for (let t of r) t instanceof Su && n.add(t.subscribe(() => {
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
				if (e instanceof Su) {
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
			n.ctx.isInteracting && (n.ctx.isDragging && lu(t, "click", (e) => e.stopPropagation(), {
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
				if ((r instanceof HTMLElement || pu(r) && !mu(r)) && this.#e.has(r)) return this.#r = t, this.#i = r, this.#i;
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
})), Vu, Hu = t((() => {
	Bu(), Vu = new zu(Ru);
})), Uu = t((() => {
	Lu();
}));
//#endregion
//#region node_modules/@neodrag/svelte/dist/index.svelte.js
function Wu(e) {
	let t = hr(e);
	function n() {
		t !== null && (t(), t = null);
	}
	try {
		Ao(n);
	} catch {}
	return n;
}
var Gu, Ku, qu, Ju = t((() => {
	Y(), Hu(), Uu(), Uu(), Mo(), Gu = (e) => (t) => (n) => e.draggable(n, t), Ku = Gu(Vu), Vu.instances, qu = class extends Su {
		static of(e) {
			let t = new Su(e);
			return Wu(() => {
				mr(() => {
					t.current = e?.();
				});
			}), t;
		}
	};
}));
//#endregion
//#region src/components/SVG/traffic-lights/CloseSVG.svelte
function Yu(e) {
	K(e, Xu());
}
var Xu, Zu = t((() => {
	Po(), cu(), Y(), Xu = /* @__PURE__ */ Ii("<svg width=\"7\" height=\"7\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path stroke=\"#000\" stroke-width=\"1.2\" stroke-linecap=\"round\" d=\"M1.182 5.99L5.99 1.182m0 4.95L1.182 1.323\"></path></svg>");
}));
//#endregion
//#region src/components/SVG/traffic-lights/ExpandSVG.svelte
function Qu(e) {
	K(e, $u());
}
var $u, ed = t((() => {
	Po(), cu(), Y(), $u = /* @__PURE__ */ Ii("<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 12.88 12.88\"><circle cx=\"6.44\" cy=\"6.44\" r=\"6.44\" fill=\"none\"></circle><path d=\"M6.5,3.34V9.66M9.66,6.5H3.34\" fill=\"none\" stroke=\"black\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path></svg>");
}));
//#endregion
//#region src/components/SVG/traffic-lights/StretchSVG.svelte
function td(e) {
	var t = nd(), n = z(R(t));
	J(n, "cx", 6.438), J(n, "cy", 6.438), J(n, "r", 6.438), D(t), K(e, t);
}
var nd, rd = t((() => {
	Po(), cu(), Y(), nd = /* @__PURE__ */ Ii("<svg viewBox=\"0 0 13 13\" xmlns=\"http://www.w3.org/2000/svg\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" stroke-linejoin=\"round\" stroke-miterlimit=\"2\"><path d=\"M4.871 3.553L9.37 8.098V3.553H4.871zm3.134 5.769L3.506 4.777v4.545h4.499z\"></path><circle fill=\"none\"></circle></svg>");
}));
//#endregion
//#region src/components/SVG/traffic-lights/GreenLight.svelte
function id(e, t) {
	let n = So(t, "expandable", 8);
	var r = Li(), i = qn(r), a = (e) => {
		Qu(e, {});
	}, o = (e) => {
		td(e, {});
	};
	ea(i, (e) => {
		n() ? e(a) : e(o, -1);
	}), K(e, r);
}
var ad = t((() => {
	Po(), cu(), Y(), ed(), rd();
}));
//#endregion
//#region src/components/SVG/traffic-lights/MinimizeSVG.svelte
function od(e) {
	var t = sd();
	J(t, "width", 6), J(t, "height", 1), J(R(t), "stroke-width", 2), D(t), K(e, t);
}
var sd, cd = t((() => {
	Po(), cu(), Y(), sd = /* @__PURE__ */ Ii("<svg fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path stroke=\"#000\" stroke-linecap=\"round\" d=\"M.61.703h5.8\"></path></svg>");
})), ld = t((() => {}));
//#endregion
//#region src/components/Desktop/Window/TrafficLights.svelte
function ud(e, t) {
	lt(t, !0);
	var n = dd();
	let r;
	var i = R(n);
	Yu(R(i), {}), D(i);
	var a = z(i, 2);
	od(R(a), {}), D(a);
	var o = z(a, 2);
	id(R(o), { get expandable() {
		return Qo[t.app_id].expandable;
	} }), D(o), D(n), br((e, s, c) => {
		r = qa(n, 1, "container s-14ulm6f", null, r, { unfocused: $.active !== t.app_id }), J(i, "aria-label", e), J(a, "aria-label", s), J(o, "aria-label", c);
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
	}), K(e, n), ut();
}
var dd, fd = t((() => {
	Po(), Y(), Zu(), ad(), cd(), $o(), Kc(), ld(), dd = /* @__PURE__ */ Pi("<div><button class=\"close-light s-14ulm6f\" data-window-action=\"close\"><!></button> <button class=\"minimize-light s-14ulm6f\" data-window-action=\"minimize\"><!></button> <button class=\"stretch-light s-14ulm6f\" data-window-action=\"maximize\"><!></button></div>"), Si(["click"]);
})), pd = t((() => {}));
//#endregion
//#region src/components/Desktop/Window/Window.svelte
function md(e, t) {
	lt(t, !0);
	let n, r = /* @__PURE__ */ F(!1), i = "", a = Math.min(1050, innerWidth - (innerWidth <= 720 ? 14 : 80)), o = Math.min(720, innerHeight - 170), s = Xo.findIndex((e) => e.id === t.app_id) % 4 * 7, c = {
		x: Math.max(7, (innerWidth - a) / 2 + s),
		y: Math.max(43, (innerHeight - o) / 2 - 40 + s)
	}, l = new qu();
	fr(() => {
		$.open[t.app_id], $.minimized[t.app_id], V(r), Xr().then(() => {
			l.current = {
				...Pu({
					allow: Nu.selector(".app-window-drag-handle"),
					block: Nu.selector("button")
				}),
				liveUpdate: !0
			};
		});
	});
	let u = qu.of(() => Fu({ default: c })), d = qu.of(() => Eu(V(r) || X.compact));
	function f() {
		n && (Zc(t.app_id), V(r) ? n.style.transform = i : (i = n.style.transform, n.style.transform = "translate(0px,0px)"), I(r, !V(r)), $.fullscreen[t.app_id] = V(r));
	}
	fr(() => {
		!$.open[t.app_id] && V(r) && (n && (n.style.transform = i), I(r, !1));
	}), ko(() => {
		let e = () => {
			Zc(t.app_id);
			let e = Math.min(1050, innerWidth - (innerWidth <= 720 ? 14 : 80)), n = Math.min(720, innerHeight - 170);
			l.current = {
				...Pu({
					allow: Nu.selector(".app-window-drag-handle"),
					block: Nu.selector("button")
				}),
				liveUpdate: !0
			}, u.current = Fu({ current: {
				x: Math.max(7, (innerWidth - e) / 2 + s),
				y: Math.max(43, (innerHeight - n) / 2 - 40 + s)
			} });
		}, r = () => {
			l.current = {
				...Pu({
					allow: Nu.selector(".app-window-drag-handle"),
					block: Nu.selector("button")
				}),
				liveUpdate: !0
			};
		};
		return n.addEventListener("window-motion-settled", r), window.addEventListener("resize", e), () => {
			window.removeEventListener("resize", e), n.removeEventListener("window-motion-settled", r);
		};
	});
	function p() {
		dl(t.app_id), $.is_being_dragged = !0;
	}
	function m() {
		$.is_being_dragged = !1;
	}
	var h = hd();
	let g, _;
	var v = R(h), y = R(v), b = R(y);
	ud(b, {
		get app_id() {
			return t.app_id;
		},
		on_close_app: () => ml(t.app_id),
		on_minimize_click: () => ml(t.app_id, !0),
		on_maximize_click: f
	});
	var x = z(b, 2), S = R(x, !0);
	D(x), D(y), La(z(y, 2), (e, t) => _l?.(e, t), () => t.app_id), D(v), D(h), ho(h, (e) => n = e, () => n), za(h, () => Ku(() => [
		Du(({ offset: e, rootNode: t }) => {
			t.style.transform = `translate(${e.x}px,${e.y}px)`;
		}),
		l,
		Au(Ou.viewport({
			top: 40,
			left: 7,
			right: 7,
			bottom: 100
		})),
		d,
		u,
		Mu({
			onDragStart: p,
			onDragEnd: m
		})
	])), br((e) => {
		J(h, "hidden", !$.open[t.app_id] || $.minimized[t.app_id]), h.inert = $.exiting[t.app_id], g = qa(h, 1, "container mac-window s-4l7tac", null, g, {
			active: $.active === t.app_id,
			"is-focused": $.active === t.app_id,
			"is-maximized": V(r)
		}), J(h, "id", `mac-window-${t.app_id ?? ""}`), J(h, "aria-labelledby", `mac-title-${t.app_id ?? ""}`), _ = Xa(h, "", _, { "z-index": $.z_indices[t.app_id] }), J(x, "id", `mac-title-${t.app_id ?? ""}`), q(S, e);
	}, [() => Z(Qo[t.app_id].key)]), G("pointerdown", h, () => dl(t.app_id)), G("focusin", h, () => dl(t.app_id)), G("dblclick", y, (e) => {
		e.target.closest("button") || f();
	}), K(e, h), ut();
}
var hd, gd = t((() => {
	Po(), Y(), Ju(), Mo(), sl(), Kc(), $o(), Lo(), xl(), fd(), pd(), hd = /* @__PURE__ */ Pi("<div role=\"dialog\" tabindex=\"-1\"><div class=\"mac-window-visual s-4l7tac\"><header class=\"mac-titlebar app-window-drag-handle s-4l7tac\"><!> <span class=\"mac-window-title s-4l7tac\"> </span></header>  <div class=\"mac-window-body s-4l7tac\" tabindex=\"0\"></div></div></div>"), Si([
		"pointerdown",
		"focusin",
		"dblclick"
	]);
})), _d = t((() => {}));
//#endregion
//#region src/components/Desktop/Window/WindowsArea.svelte
function vd(e) {
	var t = yd();
	sa(t, 5, () => Xo, ia, (e, t) => {
		md(e, { get app_id() {
			return V(t).id;
		} });
	}), D(t), K(e, t);
}
var yd, bd = t((() => {
	Po(), cu(), Y(), $o(), gd(), _d(), yd = /* @__PURE__ */ Pi("<section id=\"windows-area\" class=\"mac-window-layer s-6m3pf8\" aria-label=\"Windows\"></section>");
})), xd, Sd = t((() => {
	xd = "\nfloat hash21(vec2 p) {\n p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);\n}\nfloat noise21(vec2 p) {\n vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);\n return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),f.x),mix(hash21(i+vec2(0.,1.)),hash21(i+vec2(1.,1.)),f.x),f.y);\n}\nfloat fractal(vec2 p) {\n float f=0.0,a=0.55;\n for(int i=0;i<3;i++){f+=a*noise21(p);p=mat2(1.6,-1.2,1.2,1.6)*p+13.7;a*=0.48;}\n return f;\n}\nvec3 stars(vec2 p,float time) {\n vec2 cell=floor(p*110.0),f=fract(p*110.0)-0.5;\n float seed=hash21(cell);\n float glow=pow(max(0.0,1.0-length(f)*2.0),7.0)*step(0.991,seed);\n return vec3(0.68,0.82,1.0)*glow*(0.7+0.3*sin(time+seed*70.0));\n}\nvec3 ocean(vec2 screen,float time,vec2 pointer,float relief) {\n vec3 ray=normalize(vec3(screen.x*0.8,screen.y*0.7-0.24+pointer.y*0.045,-1.5));\n vec3 sun=normalize(vec3(0.65+pointer.x*0.12,0.20,-1.5));\n float sunDot=max(dot(ray,sun),0.0);\n vec3 sky=mix(vec3(0.86,0.30,0.20),vec3(0.12,0.23,0.43),smoothstep(-0.08,0.8,ray.y));\n sky+=vec3(1.0,0.64,0.31)*pow(sunDot,240.0)*1.2;\n sky+=vec3(1.0,0.22,0.06)*pow(sunDot,16.0)*0.23;\n if(ray.y>=0.0)return sky;\n float distance=1.2/max(-ray.y,0.003);\n vec2 p=vec2(ray.x,ray.z)*distance;\n vec2 gradient=vec2(0.0);\n for(int i=0;i<4;i++){\n  float k=float(i),frequency=0.65+k*0.8;\n  vec2 direction=vec2(cos(k*1.17),sin(k*1.17));\n  gradient+=direction*cos(dot(p,direction)*frequency+time*(0.65+k*0.23))*0.12/(1.0+k*0.5);\n }\n gradient*=0.8+relief*0.35;\n vec3 n=normalize(vec3(-gradient.x,1.0,-gradient.y));\n vec3 reflection=reflect(ray,n);\n float fresnel=pow(1.0-max(dot(-ray,n),0.0),4.0);\n vec3 water=mix(vec3(0.008,0.12,0.19),vec3(0.06,0.36,0.40),clamp(n.y*0.6+gradient.x,0.,1.));\n water=mix(water,vec3(0.76,0.35,0.22),fresnel*0.8);\n float glitter=pow(max(dot(reflection,sun),0.0),110.0);\n water+=vec3(1.0,0.70,0.36)*glitter*1.5;\n water=mix(water,sky,1.0-exp(-distance*0.009));\n return water;\n}\nvec3 nebula(vec2 p,float time,vec2 pointer,float relief) {\n p=p*1.6+pointer*0.12;\n float t=time*0.055;\n vec2 warp=vec2(fractal(p+vec2(t,-t)),fractal(p+vec2(5.1,-2.3)-t));\n float density=fractal(p+(warp-0.5)*(3.0+relief)+vec2(t*0.5,0.0));\n float cloud=smoothstep(0.24,0.86,density);\n float filament=exp(-abs(density-0.56)*32.0);\n vec3 color=mix(vec3(0.008,0.015,0.06),vec3(0.24,0.13,0.49),cloud);\n color+=vec3(0.16,0.37,0.53)*filament*(0.25+warp.y);\n float ember=smoothstep(0.47,0.78,warp.x)*cloud;\n color=mix(color,vec3(0.90,0.39,0.22),ember*0.85);\n color+=vec3(0.8,0.60,0.80)*pow(cloud,4.0)*0.6;\n return color+stars(p*0.5,time*0.2);\n}\nvec3 ribbons(vec2 p,float time,vec2 pointer,float relief) {\n p+=pointer*0.13;float t=time*0.22;\n vec3 color=vec3(0.012,0.018,0.045);\n for(int i=0;i<6;i++) {\n  float k=float(i);\n  float curve=sin(p.x*0.95+t+k*0.42)*0.42 + sin(p.x*0.37-t*0.6)*0.45;\n  float d=p.y+p.x*0.32-curve+(k-2.5)*0.28;\n  float width=0.055+0.018*sin(p.x+k+t)+relief*0.015;\n  float body=exp(-pow(d/width,2.0));\n  float edge=exp(-pow((d-width*0.6)/(width*0.23),2.0));\n  vec3 tint=0.5+0.5*cos(vec3(0.0,2.1,4.2)+k*0.73+p.x*0.18);\n  color+=tint*exp(-abs(d)*7.0)*0.09;\n  color=mix(color,tint*(0.45+body*0.45)+edge*0.38,body*0.9);\n }\n return color;\n}\nvec3 warpTunnel(vec2 p,float time,vec2 pointer,float relief) {\n p-=vec2(0.58,0.05)+pointer*0.16;\n float r=max(length(p),0.02),angle=atan(p.y,p.x);\n float depth=-log(r),t=time*(0.28+relief*0.08);\n vec3 color=vec3(0.008,0.012,0.038);\n float twist=angle+depth*0.35+sin(time*0.12)*0.3;\n float ring=abs(fract(depth*2.6-t)-0.5);\n float filament=exp(-ring*65.0)*smoothstep(0.05,0.6,r);\n float spokes=pow(0.5+0.5*sin(twist*7.0+depth),12.0);\n vec3 tint=0.5+0.5*cos(vec3(0.4,2.2,4.1)+depth*0.6+angle*0.35);\n color+=tint*filament*(0.14+spokes*0.5);\n vec2 starUv=vec2((angle/6.283185+0.5)*95.0,depth*9.0-t*2.0);\n vec2 cell=floor(starUv),f=fract(starUv)-0.5;\n float seed=hash21(cell);\n float streak=exp(-abs(f.x)*60.0-abs(f.y)*5.0)*step(0.80,seed);\n color+=mix(vec3(0.28,0.65,1.0),vec3(0.9,0.66,0.9),seed)*streak*smoothstep(0.06,0.7,r);\n color+=vec3(0.06,0.12,0.28)*exp(-r*1.8);\n return color;\n}\n";
}));
//#endregion
//#region src/components/Desktop/wallpaper/folded-scene.ts
function Cd(e) {
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
		if (t.attachShader(i, r(t.VERTEX_SHADER, wd)), t.attachShader(i, r(t.FRAGMENT_SHADER, Td)), t.linkProgram(i), !t.getProgramParameter(i, t.LINK_STATUS)) throw Error(t.getProgramInfoLog(i) || "Wallpaper shader linking failed");
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
var wd, Td, Ed = t((() => {
	Sd(), wd = "\nprecision highp float;\nattribute vec2 aUv;\nuniform float uTime, uAspect, uOpen, uMode;\nuniform vec2 uPointer;\nvarying vec3 vNormal, vPosition;\nvarying vec2 vUv;\nvec3 surface(vec2 uv) {\n float x = (uv.x * 15.0 - 7.5) * max(1.0, uAspect / 1.8);\n float y = uv.y * 5.5;\n float t = uTime * 0.12;\n float bend = y + x * 0.48 + sin(x * 0.51 + t) * 0.95;\n float wave = sin(bend * 1.65 + t);\n float ridge = pow(0.5 + wave * 0.5, 2.4);\n float z = ridge * (1.25 + uOpen * 0.35) + sin(x * 0.45 - y * 0.4 + t) * 0.42;\n z += sin(bend * 3.3 + t * 2.0) * 0.07;\n if(uMode > 0.5 && uMode < 1.5) {\n  float r = length(vec2((x - uAspect * 1.1) * 0.75, (y + 0.85) * 1.15));\n  z = sin(r * 2.0 - t * 1.8 + sin(x * 0.6 + t) * 0.7) * (0.55 + uOpen * 0.22);\n  z += cos(x * 0.65 + y * 0.8 + t) * 0.35;\n } else if(uMode > 1.5 && uMode < 2.5) {\n  float dune = y * 1.45 + sin(x * 0.33 + t * 0.5) * 1.8 + x * 0.18;\n  z = pow(0.5 + sin(dune) * 0.5, 3.8) * (1.3 + uOpen * 0.25);\n  z += sin(x * 0.3 - y * 0.2) * 0.24;\n } else if(uMode > 2.5) { z = 0.0; }\n return vec3(x + uPointer.x * 0.13, y + uPointer.y * 0.10, z);\n}\nvoid main() {\n if(uMode > 2.5) {\n  vPosition=vec3((aUv.x*2.0-1.0)*3.0*uAspect,aUv.y*3.0,0.0);\n  vNormal=vec3(0.0,0.0,1.0);vUv=aUv;\n  gl_Position=vec4(aUv.x*2.0-1.0,aUv.y,0.0,1.0);return;\n }\n vec3 p = surface(aUv);\n vec3 du = surface(aUv + vec2(0.0005,0.0)) - p;\n vec3 dv = surface(aUv + vec2(0.0,0.0005)) - p;\n vNormal = normalize(cross(du,dv)); vPosition = p; vUv = aUv;\n float depth = 6.0 - p.z;\n gl_Position = vec4(p.x / uAspect * 2.0, p.y * 2.0, (depth-3.0)*0.2, depth);\n}", Td = `
precision highp float;
uniform vec2 uPointer;
uniform float uMode, uTime, uAspect, uOpen;
varying vec3 vNormal, vPosition;
varying vec2 vUv;
${xd}
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
})), Dd = t((() => {}));
//#endregion
//#region src/components/Desktop/LiveWallpaper.svelte
function Od(e, t) {
	lt(t, !0);
	let n, r = /* @__PURE__ */ $t(() => Rl.find((e) => e.id === Bl.current));
	fr(() => {
		Bl.current, n?.();
	});
	let i, a = /* @__PURE__ */ F(!1);
	ko(() => {
		let e = Cd(i);
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
					e?.draw(c, l, u, p, Rl.findIndex((e) => e.id === Bl.current), !t.matches), I(a, !0);
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
			e.preventDefault(), g = !0, cancelAnimationFrame(r), I(a, !1);
		}, w = () => {
			g = !1, e?.dispose(), e = Cd(i), e && y();
		};
		return window.addEventListener("pointermove", b, { passive: !0 }), document.documentElement.addEventListener("pointerleave", x), window.addEventListener("click", S), window.addEventListener("resize", y), document.addEventListener("visibilitychange", v), t.addEventListener("change", v), i.addEventListener("webglcontextlost", C), i.addEventListener("webglcontextrestored", w), y(), () => {
			n = void 0, h = !0, cancelAnimationFrame(r), e?.dispose(), window.removeEventListener("pointermove", b), document.documentElement.removeEventListener("pointerleave", x), window.removeEventListener("click", S), window.removeEventListener("resize", y), document.removeEventListener("visibilitychange", v), t.removeEventListener("change", v), i.removeEventListener("webglcontextlost", C), i.removeEventListener("webglcontextrestored", w);
		};
	});
	var o = kd(), s = R(o);
	let c;
	var l = z(s, 2);
	let u;
	ho(l, (e) => i = e, () => i), Je(2), D(o), br(() => {
		J(o, "data-wallpaper", Bl.current), Xa(o, `--fallback-base:${V(r).colors[0]};--fallback-mid:${V(r).colors[1]};--fallback-light:${V(r).colors[2]}`), c = qa(s, 0, "wallpaper-fallback s-fa2i1z", null, c, { concealed: V(a) }), u = qa(l, 1, "s-fa2i1z", null, u, { visible: V(a) });
	}), K(e, o), ut();
}
var kd, Ad = t((() => {
	Po(), Y(), Vl(), Mo(), Ed(), Dd(), kd = /* @__PURE__ */ Pi("<div class=\"live-wallpaper s-fa2i1z\" aria-hidden=\"true\"><svg viewBox=\"0 0 1600 1000\" preserveAspectRatio=\"xMidYMid slice\"><defs><linearGradient id=\"fold-base\" x2=\"1\" y2=\"1\"><stop stop-color=\"#171444\"></stop><stop offset=\".5\" stop-color=\"#3031b2\"></stop><stop offset=\"1\" stop-color=\"#7b32c2\"></stop></linearGradient><linearGradient id=\"fold-ribbon\" x1=\"0\" y1=\"1\" x2=\"1\" y2=\"0\"><stop stop-color=\"#08143b\"></stop><stop offset=\".43\" stop-color=\"#233cb9\"></stop><stop offset=\".67\" stop-color=\"#8984f4\"></stop><stop offset=\".72\" stop-color=\"#b1b7ff\"></stop><stop offset=\".79\" stop-color=\"#6032b7\"></stop><stop offset=\"1\" stop-color=\"#24123e\"></stop></linearGradient></defs><path fill=\"url(#fold-base)\" d=\"M0 0h1600v1000H0z\"></path><g fill=\"url(#fold-ribbon)\"><path d=\"M-400 -400C600 -300 380 600 1900 700L1900 1200C650 1000 300 100 -400 200Z\"></path><path d=\"M-400 200C450 100 500 1000 1900 1100L1900 1500C400 1300 200 650 -400 800Z\"></path><path d=\"M-200 -700C1100 -400 800 200 1800 300L1900 700C800 600 400 -200 -200 -100Z\"></path></g></svg> <canvas></canvas> <div class=\"wallpaper-shade s-fa2i1z\"></div></div>");
})), jd = t((() => {})), Md = /* @__PURE__ */ n({ default: () => Nd });
function Nd(e, t) {
	lt(t, !0);
	let n = /* @__PURE__ */ F("");
	function r() {
		I(n, new Intl.DateTimeFormat(X.locale, {
			month: "short",
			day: "numeric",
			weekday: "short",
			hour: "2-digit",
			minute: "2-digit",
			hour12: !1
		}).format(/* @__PURE__ */ new Date()), !0);
	}
	ko(() => {
		let e = () => {
			X.locale = document.documentElement.lang, document.querySelectorAll("[data-desktop-text]").forEach((e) => e.textContent = Z(e.dataset.desktopText)), r();
		}, t = matchMedia("(prefers-reduced-motion: reduce)"), n = () => {
			X.reduced = t.matches, X.reduced && Zc();
		}, i = () => X.compact = innerWidth <= 720, a = (e) => {
			e.key === "Escape" && $.active && !document.fullscreenElement && (e.preventDefault(), ml($.active));
		}, o = (e) => {
			let t = e.target, n = t.closest(".mac-project-launcher");
			if (n) {
				e.preventDefault(), fl(n.dataset.appOpen);
				return;
			}
			let r = t.closest("a[href^=\"#\"]");
			if (!r) return;
			let i = r.getAttribute("href").slice(1);
			if (i === "top") {
				e.preventDefault(), hl();
				return;
			}
			if (i === "main-content") {
				e.preventDefault(), fl("projects");
				return;
			}
			let a = Xo.find((e) => e.hash === i || document.getElementById(i)?.closest(`#mac-window-${e.id}`));
			a && (e.preventDefault(), fl(a.id));
		};
		document.addEventListener("portfolio:localechange", e), document.addEventListener("click", o), document.addEventListener("keydown", a), window.addEventListener("popstate", gl), window.addEventListener("hashchange", gl), window.addEventListener("resize", i), t.addEventListener("change", n);
		let s = setInterval(r, 3e4);
		r();
		let c = Fo(document.querySelector("[data-desktop-home] img"), X.reduced);
		return document.documentElement.classList.add("desktop-ready"), document.body.classList.add("has-desktop"), document.querySelectorAll(".is-pending").forEach((e) => e.classList.remove("is-pending")), gl(), () => {
			c(), clearInterval(s), document.removeEventListener("portfolio:localechange", e), document.removeEventListener("click", o), document.removeEventListener("keydown", a), window.removeEventListener("popstate", gl), window.removeEventListener("hashchange", gl), window.removeEventListener("resize", i), t.removeEventListener("change", n);
		};
	});
	var i = Fd(), a = R(i);
	Od(a, {});
	var o = z(a, 2), s = R(o), c = R(s), l = z(c), u = z(l), d = R(u, !0);
	D(u);
	var f = z(u), p = R(f, !0);
	D(f);
	var m = z(f), h = R(m, !0);
	D(m), D(s);
	var g = z(s, 2), _ = R(g);
	tu(_, {});
	var v = z(_), y = R(v, !0);
	D(v), D(g), D(o);
	var b = z(o, 2), x = R(b), S = R(x, !0);
	D(x);
	var C = z(x), w = R(C, !0);
	D(C);
	var ee = z(C), te = R(ee, !0);
	D(ee);
	var ne = z(ee), re = R(ne, !0);
	D(ne);
	var ie = z(ne), ae = R(ie), oe = R(ae, !0);
	D(ae), Je(), D(ie), D(b);
	var se = z(b, 2);
	sa(se, 20, () => [
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
	], ia, (e, t) => {
		var n = Pd(), r = R(n);
		ha(r, () => Go[t.id], !0), D(r);
		var i = z(r), a = R(i, !0);
		D(i), D(n), br((e) => q(a, e), [() => Z(t.label)]), G("click", n, () => fl(t.id)), K(e, n);
	}), D(se);
	var ce = z(se, 2), le = z(R(ce)), ue = R(le, !0);
	D(le), D(ce);
	var de = z(ce, 2);
	vd(de, {}), Dl(z(de, 2), {}), D(i), br((e, t, r, i, a, o, s, l, u, f, m) => {
		J(c, "aria-label", e), q(d, t), q(p, r), q(h, i), q(y, V(n)), q(S, a), q(w, o), q(te, s), q(re, l), q(oe, u), J(se, "aria-label", f), q(ue, m);
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
	]), G("click", c, () => hl()), G("click", l, () => fl("about")), G("click", f, () => fl("projects")), G("click", m, () => fl("contact")), G("click", ie, () => fl("projects")), K(e, i), ut();
}
var Pd, Fd, Id = t((() => {
	Po(), Y(), Io(), Mo(), jl(), su(), bd(), Ad(), $o(), sl(), Lo(), Kc(), xl(), jd(), Pd = /* @__PURE__ */ Pi("<button class=\"mac-shortcut\"><span class=\"mac-file-icon\"></span><span> </span></button>"), Fd = /* @__PURE__ */ Pi("<div class=\"container mac-desktop s-147wjjy\"><!> <header class=\"mac-menubar\"><div class=\"mac-menu-left\"><button class=\"mac-home\" data-desktop-home=\"\"><img src=\"./assets/images/github-avatar.jpg\" width=\"22\" height=\"22\" alt=\"\"/></button><button class=\"mac-brand\">Jason Chen</button><span class=\"mac-current-app\"> </span><button class=\"mac-menu-link\"> </button><button class=\"mac-menu-link\"> </button></div> <div class=\"mac-menu-right\"><!><time class=\"mac-clock\"> </time></div></header> <div class=\"mac-desktop-intro s-147wjjy\"><p class=\"mac-overline s-147wjjy\"> </p><p class=\"mac-greeting s-147wjjy\"> </p><p class=\"mac-headline s-147wjjy\"> </p><p class=\"mac-description s-147wjjy\"> </p><button class=\"mac-explore s-147wjjy\"><span> </span><span aria-hidden=\"true\">↗</span></button></div> <nav class=\"mac-shortcuts\"></nav> <p class=\"mac-desktop-signature\">JASON’S WORKSPACE<span> </span></p> <!> <!></div>"), Si(["click"]);
}));
Mo(), document.readyState === "loading" && await new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
var { default: Ld } = await Promise.resolve().then(() => (Id(), Md)), Rd = document.createElement("div");
Rd.id = "macos-root", document.body.append(Rd), zi(Ld, { target: Rd });
//#endregion
