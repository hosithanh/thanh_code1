import { Modal } from 'antd'
import { ModalFuncProps } from 'antd/lib/modal'
export default function showConfirm(props: ModalFuncProps): void {
    Modal.confirm({ ...props })
}
