import {newEnforcer} from "casbin.js";
import {CanParams, CanReturnType} from "@refinedev/core";

import {adapter, model} from "./accessControl";
import {authProvider} from "./authProvider";

export const accessControlProvider = {
    can: async ({action, resource}: CanParams): Promise<CanReturnType> => {
        const role = await authProvider.getPermissions?.();
        const enforcer = await newEnforcer(model, adapter);
        const can = await enforcer.enforce(role, resource, action);

        return Promise.resolve({
            can,
        });
    }
}