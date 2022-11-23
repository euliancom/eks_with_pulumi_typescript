import * as pulumi from "@pulumi/pulumi";
import "mocha";

pulumi.runtime.setMocks({
    newResource: function(args: pulumi.runtime.MockResourceArgs): {id: string, state: any} {
        switch (args.type) {
            default:
                return {
                    id: args.inputs.name + "_id",
                    state: {
                        ...args.inputs,
                    },
                };
        }
    },
    call: function(args: pulumi.runtime.MockCallArgs) {
        switch (args.token) {
            default:
                return args;
        }
    },
});

describe("Infrastructure", function() {
    let infra: typeof import("./index");

    before(async function() {
        // It's important to import the program _after_ the mocks are defined.
        infra = await import("./index");
    });

    describe("#eks", function() {
        // check 1: Instances have a Name tag.
        it("must have a name tag", function(done) {
            pulumi.all([infra.eksConfig.urn, infra.eksConfig.tags]).apply(([urn, tags]) => {
                if (!tags || !tags["Name"]) {
                    done(new Error(`Missing a name tag on eks ${urn}`));
                } else {
                    done();
                }
            });
        });
    });
});