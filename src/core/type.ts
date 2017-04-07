export interface ISnapshottable<S> {}

export interface IType<S, T> {
    name: string
    is(thing: any): thing is S | T
    create(snapshot?: S): T
    isType: boolean
    describe(): string,
    Type: T
    SnapshotType: S
}

export interface ISimpleType<T> extends IType<T, T> { }

export interface IComplexType<S, T> extends IType<S, T & ISnapshottable<S> & IMSTNode> { }

export function isType(value: any): value is IType<any, any> {
    return typeof value === "object" && value && value.isType === true
}

export abstract class Type<S, T> implements IType<S, T> {
    name: string
    isType = true

    constructor(name: string) {
        this.name = name
    }

    abstract create(snapshot: any): any
    abstract is(thing: any): thing is S | T
    abstract describe(): string

    get Type(): T {
        return fail("Factory.Type should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.Type`")
    }
    get SnapshotType(): S {
        return fail("Factory.SnapshotType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.SnapshotType`")
    }
}

export function typecheck(type: IType<any, any>, value: any): void {
    if (!type.is(value)) {
        const currentTypename = maybeMST(value, node => ` of type ${node.type.name}:`, () => "")
        fail(`Value${currentTypename} '${isSerializable(value) ? JSON.stringify(value) : value}' is not assignable to type: ${type.name}. Expected ${type.describe()} instead.`)
    }
}

import { fail, isSerializable } from "../utils"
import { IMSTNode, maybeMST } from "./mst-node"
