import { table, findRecordByFilter, getMinifiedRecords } from "../../lib/airTable";
const favouriteCoffeeStoreById = async (req, res) => {
    if (req.method === 'PUT') {
        try {
            const { id } = req.body;
            if (id) {
                const records = await findRecordByFilter(id);
                if (records.length !== 0) {
                    const record = records[0];
                    const calculateVoting = parseInt(record.voting) + parseInt(1);
                    //update a record
                    const updateRecord = await table.update([
                        {
                            id: record.recordId,
                            fields: {
                                voting: calculateVoting,
                            },
                        },
                    ]);
                    if (updateRecord) {
                        const minifiedRecord = getMinifiedRecords(updateRecord);
                        res.json(minifiedRecord);

                    }


                }
                else {
                    res.json({ message: "coffee store id does not exit", id });
                }
            }
            else {
                res.status(400);
                res.json({ message: "Id is missing" });
            }
        }
        catch (err) {
            res.status(500);
            res.json({ message: "Error upvoting coffee", id });
        }
    }
};

export default favouriteCoffeeStoreById;