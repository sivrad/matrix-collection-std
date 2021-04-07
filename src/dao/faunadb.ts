import { Source, errors as matrixErrors } from '@sivrad/matrix';
import { Client, query as q, errors as faunaDBErrors } from 'faunadb';

export interface FauanDBRefrenceResponce {
    ref: {
        '@ref': {
            id: string;
            collection: {
                '@ref': {
                    id: string;
                    collection: {
                        '@ref': {
                            id: 'collections';
                        };
                    };
                };
            };
        };
    };
    ts: number;
    data: Record<string, unknown>;
}

/**
 * FaunaDB Source.
 */
export class FaunaDBSource extends Source {
    private client: Client;

    /**
     * Constructor for a FaunaDB Source.
     * @param {string} apikey The FaunaDB apikey.
     */
    constructor(apikey: string) {
        super();
        this.client = new Client({ secret: apikey });
    }

    /**
     * Check for the Collection's existance, create if not found.
     * @param {string} typeName The name of the type.
     */
    async initializeType(typeName: string): Promise<void> {
        try {
            await this.client.query(q.Collection(typeName));
        } catch (e) {
            if (e instanceof faunaDBErrors.NotFound) {
                await this.client.query(q.CreateCollection(typeName));
            }
        }
    }

    /**
     * Read from the database.
     * @param   {string}             typeName    The name of the type.
     * @param   {string}             id          Id of the type.
     * @throws  {InstanceNotFound}               If the Id does not match a type.
     * @throws  {UnknownSourceError}             If there is an unknown error.
     * @returns {Promise<T>}                     The data.
     */
    async getInstance<T extends Record<string, unknown>>(
        typeName: string,
        id: string,
    ): Promise<T> {
        try {
            const result = await this.client.query<FauanDBRefrenceResponce>(
                q.Get(q.Ref(q.Collection(typeName), id)),
            );
            return result.data as T;
        } catch (e) {
            if (e instanceof faunaDBErrors.NotFound) {
                throw new matrixErrors.InstanceNotFound(typeName, id);
            } else {
                console.log(e);
                throw new matrixErrors.UnknownSourceError();
            }
        }
    }

    /**
     * Write data to the database.
     * @param   {string} typeName The name of the type.
     * @param {string} id   Id of the type.
     * @param {T}      data Data to write to.
     * @returns {Promise<T>} The updated data.
     */
    async updateInstance<T>(typeName: string, id: string, data: T): Promise<T> {
        try {
            const result = await this.client.query<FauanDBRefrenceResponce>(
                q.Update(q.Ref(q.Collection(typeName), id), { data }),
            );
            return result.data as T;
        } catch (e) {
            console.error(e);
            throw new matrixErrors.UnknownSourceError();
        }
    }

    /**
     * Create a type instance.
     * @param {string} typeName The type name.
     * @param {T}      data     Data object.
     * @returns {string}        The newly created identifier.
     */
    async createInstance<T>(typeName: string, data: T): Promise<string> {
        try {
            const result = await this.client.query<FauanDBRefrenceResponce>(
                q.Create(q.Collection(typeName), { data }),
            );
            return JSON.parse(JSON.stringify(result)).ref['@ref'].id;
        } catch (e) {
            console.error(e);
            throw new matrixErrors.UnknownSourceError();
        }
    }
}
