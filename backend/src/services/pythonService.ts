import { spawn } from "child_process";

export default class ConnectionPY {
    public static connection = (
        fileName: string,
        args: string[]
    ): Promise<string> => {
        return new Promise<string>((resolved, error) => {
            const pyConn = spawn('python', [`${process.cwd()}/src/AI/${fileName}`, ...args]);

            pyConn.stdout.on('data', function (data) {
                resolved(data.toString());
            });

            pyConn.stderr.on('data', (data) => {
                error(data.toString());
            });
        });
    };
}