const tree = () => {
    // Деревья 
    const MAX_AGE = 80;
    const LEAF_DISTANCE = 6;
    const DIAMETER = 10;
    const LEAFE_SIZE = 3;
    const TREE_VARIANCE = 2;
    const BRANCH_VARIANCE = 30;
    const DRAW_DISTANCE = 3;

    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d", {
        alpha: false
    });

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    /* ~~~~~ */

    class PerlinNoise {
        static grad3 = [
            [1, 1, 0],
            [-1, 1, 0],
            [1, -1, 0],
            [-1, -1, 0],
            [1, 0, 1],
            [-1, 0, 1],
            [1, 0, -1],
            [-1, 0, -1],
            [0, 1, 1],
            [0, -1, 1],
            [0, 1, -1],
            [0, -1, -1]
        ];

        constructor() {
            this.p = [];
            for (let i = 0; i < 256; i++) {
                this.p[i] = ~~(Math.random() * 256);
            }

            this.perm = [];
            for (let i = 0; i < 512; i++) {
                this.perm[i] = this.p[i & 255];
            }
        }

        static dot(g, x, y, z) {
            return g[0] * x + g[1] * y + g[2] * z;
        }

        static mix(a, b, t) {
            return (1.0 - t) * a + t * b;
        }

        static fade(t) {
            return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
        }

        at(x = 0, y = 0, z = 0) {
            let X = ~~x;
            let Y = ~~y;
            let Z = ~~z;

            x = x - X;
            y = y - Y;
            z = z - Z;

            X = X & 255;
            Y = Y & 255;
            Z = Z & 255;

            const gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12;
            const gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12;
            const gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12;
            const gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;
            const gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12;
            const gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12;
            const gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12;
            const gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;

            const n000 = PerlinNoise.dot(PerlinNoise.grad3[gi000], x, y, z);
            const n100 = PerlinNoise.dot(PerlinNoise.grad3[gi100], x - 1, y, z);
            const n010 = PerlinNoise.dot(PerlinNoise.grad3[gi010], x, y - 1, z);
            const n110 = PerlinNoise.dot(PerlinNoise.grad3[gi110], x - 1, y - 1, z);
            const n001 = PerlinNoise.dot(PerlinNoise.grad3[gi001], x, y, z - 1);
            const n101 = PerlinNoise.dot(PerlinNoise.grad3[gi101], x - 1, y, z - 1);
            const n011 = PerlinNoise.dot(PerlinNoise.grad3[gi011], x, y - 1, z - 1);
            const n111 = PerlinNoise.dot(PerlinNoise.grad3[gi111], x - 1, y - 1, z - 1);

            const u = PerlinNoise.fade(x);
            const v = PerlinNoise.fade(y);
            const w = PerlinNoise.fade(z);

            const nx00 = PerlinNoise.mix(n000, n100, u);
            const nx01 = PerlinNoise.mix(n001, n101, u);
            const nx10 = PerlinNoise.mix(n010, n110, u);
            const nx11 = PerlinNoise.mix(n011, n111, u);
            const nxy0 = PerlinNoise.mix(nx00, nx10, v);
            const nxy1 = PerlinNoise.mix(nx01, nx11, v);
            const nxyz = PerlinNoise.mix(nxy0, nxy1, w);

            return nxyz;
        }
    }

    /* ~~~~~ */

    const radians = (degrees) => (degrees * Math.PI) / 180;
    const noise = new PerlinNoise();
    const trees = [];

    class Point {
        constructor(x, y, colour, age = 0, degrees = 0, variance = 0) {
            this.x = x;
            this.y = y;
            this.opacity = (MAX_AGE - age) / MAX_AGE;
            this.colour = colour;
            this.radius = DIAMETER;
            this.age = age;
            this.degrees = degrees;
            this.variance = variance;
        }
    }

    const addLeaf = (tree, point) => {
        const leaf = new Point(
            point.x + (-LEAF_DISTANCE + Math.random() * (LEAF_DISTANCE * 2)),
            point.y + (-LEAF_DISTANCE + Math.random() * (LEAF_DISTANCE * 2)),
            [point.colour[0] + 25, point.colour[1], point.colour[2]]
        );

        leaf.opacity = 0;
        leaf.spawned = true;
        leaf.radius = LEAFE_SIZE + Math.random() * (LEAFE_SIZE * 2);

        tree.leaves.push(leaf);
    };

    class Tree {
        constructor(x = 0, y = 0, colour) {
            this.x = x;
            this.y = y;
            this.points = [new Point(x, y, colour, 0, -90, TREE_VARIANCE)];
            this.leaves = [];
        }
    }

    const update = (tree) => {
        if (tree.done) return;

        let done = true;

        tree.points.forEach((point) => {
            if (point.spawned || point.age >= MAX_AGE) {
                return;
            }

            done = false;

            ++point.age;

            const branch = (variance) => {
                const reduce = 0.01;
                const n =
                    (noise.at(
                            (point.x + point.age) * reduce,
                            (point.y + point.age) * reduce
                        ) -
                        0.5) *
                    4 *
                    Math.PI;
                const mag = noise.at(
                    (point.y + point.age) * reduce,
                    (point.x + point.age) * reduce
                );
                const dirX = Math.cos(n) * mag;
                const dirY = Math.sin(n) * mag;

                const diff = variance * point.opacity;
                const degrees = point.degrees + (-diff + Math.random() * diff * 2);

                const randX = Math.cos(radians(degrees)) * DRAW_DISTANCE;
                const randY = Math.sin(radians(degrees)) * DRAW_DISTANCE;

                const x = point.x + dirX + randX;
                const y = point.y + dirY + randY;

                tree.points.push(
                    new Point(x, y, point.colour, point.age, degrees, variance)
                );
            };

            if (
                point.age > MAX_AGE * 0.2 &&
                point.age < MAX_AGE * 0.8 &&
                Math.random() < 0.07 * (1 - point.opacity * 0.4)
            ) {
                branch(point.variance + BRANCH_VARIANCE);
            }

            if (Math.random() < 0.2 && point.age > MAX_AGE * 0.8) {
                addLeaf(tree, point);
                addLeaf(tree, point);
                addLeaf(tree, point);
            }

            branch(point.variance);

            point.spawned = true;
        });

        tree.done = done;
    };

    const addTree = (x, y) => {
        ctx.fillStyle = "#1C1F22";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const colour = [Math.random() * 360, 80, 80];

        trees.push(new Tree(x, y, colour));
    };

    const drawPoint = (point, radius, opacity = 1) => {
        ctx.beginPath();
        ctx.arc(
            point.x,
            point.y,
            radius || point.radius * point.opacity,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = `hsla(${point.colour[0]}, ${point.colour[1]}%, ${
point.colour[2] + 20 * point.opacity
}%, ${opacity})`;
        ctx.fill();
    };

    const draw = (tree) => {
        let done = true;
        tree.points.forEach((point) => {
            if (point.drawn) return;

            done = false;
            drawPoint(point);
            point.drawn = true;
        });

        done &&
            tree.leaves.forEach((point) => {
                if (point.drawn) return;

                done = false;
                drawPoint(point, point.radius, 0.15);
                point.drawn = true;
            });

        done && trees.splice(trees.indexOf(tree), 1);
    };

    const loop = () => {
        trees.forEach(update);
        trees.forEach(draw);
        window.requestAnimationFrame(loop);
    };

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "normal normal 100 30px Helvetica";
    ctx.textAlign = "center";
    ctx.textSize = 20;
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillText("Click to plant some trees.", canvas.width / 2, canvas.height / 2);

    loop();

    canvas.onmousedown = (e) => {
        addTree(e.offsetX, e.offsetY, 1);
    };

    addTree(canvas.width * 0.1, canvas.height * 0.8, 1);
    addTree(canvas.width * 0.9, canvas.height * 0.8, 1);

}

export default tree;