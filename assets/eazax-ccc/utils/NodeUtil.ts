/**
 * 节点工具
 * @author 陈皮皮 (ifaswind)
 * @version 20211019
 * @see NodeUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/NodeUtil.ts
 */
export default class NodeUtil {

    /**
     * 获取像素数据
     * @param node 节点
     * @param flipY 垂直翻转数据
     */
    public static getPixelsData(node: cc.Node, flipY: boolean = true) {
        if (!cc.isValid(node)) {
            return null;
        }
        // 节点宽高
        const width = Math.floor(node.width),
            height = Math.floor(node.height);
        // 创建临时摄像机用于渲染目标节点
        const cameraNode = new cc.Node();
        cameraNode.parent = node;
        const camera = cameraNode.addComponent(cc.Camera);
        camera.clearFlags |= cc.Camera.ClearFlags.COLOR;
        camera.backgroundColor = cc.color(0, 0, 0, 0);
        camera.zoomRatio = cc.winSize.height / height;
        // 将节点渲染到 RenderTexture 中
        const renderTexture = new cc.RenderTexture();
        renderTexture.initWithSize(width, height, cc.RenderTexture.DepthStencilFormat.RB_FMT_S8);
        camera.targetTexture = renderTexture;
        camera.render(node);
        // 获取像素数据
        const pixelsData = renderTexture.readPixels();
        // 销毁临时对象并返回数据
        renderTexture.destroy();
        cameraNode.destroy();
        // 垂直翻转数据
        if (flipY) {
            const length = pixelsData.length,
                lineWidth = width * 4,
                data = new Uint8Array(length);
            for (let i = 0, j = length - lineWidth; i < length; i += lineWidth, j -= lineWidth) {
                for (let k = 0; k < lineWidth; k++) {
                    data[i + k] = pixelsData[j + k];
                }
            }
            return data;
        }
        return pixelsData;
    }

    /**
     * 获取节点在目标节点（容器）下的相对位置
     * @param node 节点
     * @param container 目标节点（容器）
     */
    public static getRelativePosition(node: cc.Node, container: cc.Node): cc.Vec2 {
        const worldPos = (node.getParent() || node).convertToWorldSpaceAR(node.getPosition());
        return container.convertToNodeSpaceAR(worldPos);
    }

    /**
     * 坐标是否在目标节点范围内
     * @param pos 坐标
     * @param target 目标节点
     */
    public static isPosOnNodeRect(pos: cc.Vec2, target: cc.Node): boolean {
        const rect = target.getBoundingBoxToWorld();
        return rect.contains(pos);
    }

    /**
     * 两个节点是否重叠
     * @param node1 节点 1
     * @param node2 节点 2
     * @param contains 是否完全包含
     */
    public static areNodesOverlap(node1: cc.Node, node2: cc.Node, contains: boolean = false): boolean {
        const rect1 = node1.getBoundingBoxToWorld(),
            rect2 = node2.getBoundingBoxToWorld();
        return contains ? rect1.containsRect(rect2) : rect1.intersects(rect2);
    }

    /**
     * 获取节点本身在世界坐标系下的对齐轴向的包围盒（不包含子节点）
     * @param node 节点
     */
    public static getNodeSelfBoundingBoxToWorld(node: cc.Node) {
        node.parent['_updateWorldMatrix']();
        const { width, height } = node.getContentSize(),
            anchorPoint = node.getAnchorPoint(),
            rect = cc.rect(
                -anchorPoint.x * width,
                -anchorPoint.y * height,
                width,
                height
            );
        node['_calculWorldMatrix']();
        rect.transformMat4(rect, node['_worldMatrix']);
        return rect;
    }

}
