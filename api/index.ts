import datasource from "./src/misc/datasource";

const main = async () => {
    await datasource.initialize();
    await datasource.synchronize();
};

main().catch(err => {
    console.error(err);
    process.exit(1);
});
