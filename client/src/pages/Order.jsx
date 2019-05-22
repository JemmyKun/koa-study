import React, { Component } from 'react';
import { Table, Icon, Input, Pagination, message, Modal, Button, Switch } from 'antd';
import { getList, hadnleAddOrder, deleteOrder, changeOrderStatus, editOrder } from '../api/api';
import './order.scss';
import { format } from 'date-fns';

const Search = Input.Search;
const confirm = Modal.confirm;

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
            pageSize: 10,
            data: {
                totalCount: 400,
                current: 1,
                content: []
            },
            searchKey: '',
            loading: false,
            pagination: {},
            isShowUpdateModal: false,
            editOrderName: '',
            curItem: null,
            handelType: 'addOrder'
        }
        this.columns = [
            {
                title: '订单名称',
                dataIndex: 'name',
                width: '20%',
                render: name => name,
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                width: '20%',
                render: (createTime) => <span>{format(createTime, 'YYYY-MM-DD HH:mm:ss')}</span>
            },
            {
                title: '修改时间',
                dataIndex: 'updateTime',
                render: (updateTime) => <span>{format(updateTime, 'YYYY-MM-DD HH:mm:ss')}</span>
            },
            {
                title: '订单状态',
                className: 'status-box',
                dataIndex: 'status',
                render: (status, item) => {
                    let showIcon = null;
                    let checkFlag = status === '0' ? true : false;
                    showIcon = (
                        <Switch
                            checkedChildren="启用"
                            unCheckedChildren="禁用"
                            checked={checkFlag}
                            onChange={this.handleOrderStatus.bind(this, item)}
                        />
                    );
                    return (
                        <span className={'handle-list-name'}>
                            {showIcon}
                        </span>
                    );
                }
            },
            {
                title: '操作',
                dataIndex: 'handle',
                className: 'handle-box',
                render: (handle, item) => {
                    let { status } = item;
                    let clName = status === '0' ? '' : 'disable';
                    return (
                        <div className="handle-box">
                            <Icon type="eye" onClick={this.getDeviceDetail.bind(this, item)} title="查看详情"
                                className={clName} />
                            <Icon type="edit" onClick={() => this.showEditModal(item, 'editOrder')} ></Icon>
                            <Icon type="delete" onClick={this.showConfirm.bind(this, item)}></Icon>
                        </div >
                    )
                }
            },
        ];
    }

    getDeviceDetail(item) {
        let { id } = item;
        this.props.history.push(`/order/${id}`)
    }

    showEditModal(item, type) {
        let editOrderName = type === 'editOrder' ? item.name : '';
        this.setState({
            editOrderName,
            curItem: item,
            handelType: type,
            isShowUpdateModal: true,
        })
    }

    componentDidMount() {
        this.getDataList();
    }

    showConfirm(item) {
        let that = this;
        return confirm({
            title: '删除',
            content: '确定删除吗？',
            onOk() {
                that.deleteOrderItem(item);
            }
        });
    }

    deleteOrderItem(item) {
        let param = {
            id: item.id
        }
        deleteOrder(param).then(res => {
            if (res.data.status === 200) {
                message.success('删除成功');
                this.getDataList();
            } else {
                message.warning(res.data.message || '删除失败');
            }
        }).catch(err => {
            console.log(err);
            message.warning('服务异常');
        })
    }

    getDataList() {
        let { count, pageSize, searchKey } = this.state;
        let param = {
            count,
            pageSize,
            searchKey
        }
        this.setState({
            loading: true
        });
        getList(param).then(res => {
            this.setState({
                loading: false
            });
            if (res.data.status === 200) {
                let data = res.data.content;
                this.setState({
                    data
                })
                if (res.data.content.content.length === 0 && count !== 1) {
                    this.setState({
                        count: 1
                    }, () => {
                        this.getDataList();
                    })
                }
            } else {
                message.warning(res.data.message || '服务异常');
            }
        }).catch(err => {
            this.setState({
                loading: false
            });
            console.log(err);
            message.warning('服务异常');
        })
    }

    handleInput(e) {
        let searchKey = e.target.value;
        this.setState({
            searchKey
        }, () => {
            if (searchKey === '') {
                this.handleSearch();
            }
        });
    }

    handleSearch() {
        this.setState({
            count: 1
        }, () => {
            this.getDataList();
        })
    }

    handleTableChange(e) {
        let { current, pageSize } = e;
        this.setState({
            count: current,
            pageSize
        }, () => {
            this.getDataList();
        })
    }

    handlePaginationChange(current) {
        this.setState({
            count: current,
        }, () => {
            this.getDataList();
        })
    }

    closeUpdateMacModal() {
        this.setState({
            isShowUpdateModal: false
        })
    }

    confirmUpateName() {
        let { handelType } = this.state;
        if (handelType === 'editOrder') {
            this.handleEditOrder();
        }
        if (handelType === 'addOrder') {
            this.handleAddOrder();
        }
    }

    handleAddOrder() {
        let { editOrderName } = this.state;
        let param = {
            name: editOrderName
        }
        hadnleAddOrder(param).then(res => {
            if (res.data.status === 200) {
                message.success('添加成功');
                this.getDataList();
                this.closeUpdateMacModal();
            } else {
                message.warning(res.data.message || '添加失败');
            }
        }).catch(err => {
            message.warning('服务异常');
        })
    }

    handleEditOrder() {
        let { editOrderName } = this.state;
        let { id } = this.state.curItem;
        let param = {
            name: editOrderName,
            id
        }
        editOrder(param).then(res => {
            if (res.data.status === 200) {
                message.success('修改成功');
                this.getDataList();
                this.closeUpdateMacModal();
            } else {
                message.warning(res.data.message || '修改失败');
            }
        }).catch(err => {
            message.warning('服务异常');
        })
    }

    updateItemChange(e) {
        let editOrderName = e.target.value;
        this.setState({
            editOrderName
        })
    }

    handleOrderStatus(item) {
        let { id, status } = item;
        let param = {
            id,
            status
        }
        changeOrderStatus(param).then(res => {
            if (res.data.status === 200) {
                message.success('修改成功');
                this.getDataList();
            } else {
                message.warning(res.data.message || '修改失败');
            }
        }).catch(err => {
            message.warning('服务异常');
        })
    }

    render() {
        let { searchKey, data, editOrderName } = this.state;
        let { totalCount, content } = data;
        let count = totalCount % this.state.pageSize;
        let pageTotal = count > 0 ? parseInt(totalCount / this.state.pageSize) + 1 : totalCount / this.state.pageSize;

        return (
            <div className="order-container">
                <h1 className="order-title">koa-app</h1>
                <div className="order-head">
                    <span className="search-wrap">
                        <Search
                            placeholder="搜索关键字"
                            enterButton="搜索"
                            size="large"
                            onSearch={this.handleSearch.bind(this)}
                            onChange={this.handleInput.bind(this)}
                            value={searchKey}
                            allowClear
                        />
                    </span>
                    <span>
                        <Button type="primary" size="large" onClick={() =>
                            this.showEditModal(null, 'addOrder')
                        }>
                            新增订单
                        </Button>
                    </span>
                </div>
                <Table
                    columns={this.columns}
                    rowKey={item => item.id}
                    dataSource={content}
                    // pagination={{
                    //     current: this.state.count,
                    //     pageSize: this.state.pageSize,
                    //     showSizeChanger: true,
                    //     pageSizeOptions: ['10', '20', '50'],
                    //     total: totalCount
                    // }}
                    pagination={false}
                    loading={this.state.loading}
                    onChange={this.handleTableChange.bind(this)}
                />

                <div className="pager-wrapper">
                    <span>共{totalCount}条/{pageTotal}页</span>
                    <span>
                        <Pagination total={totalCount}
                            showSizeChanger
                            size="large"
                            showQuickJumper
                            onShowSizeChange={(current, size) => {
                                this.setState({
                                    pageSize: size,
                                    count: current
                                }, () => {
                                    this.getDataList();
                                })
                            }}
                            onChange={this.handlePaginationChange.bind(this)}
                            pageSize={this.state.pageSize}
                            current={this.state.count}
                        />
                    </span>
                </div>
                <Modal
                    title="修改订单名称"
                    onOk={() => this.confirmUpateName()}
                    onCancel={() => this.closeUpdateMacModal()}
                    visible={this.state.isShowUpdateModal}
                >
                    <ul className="user-info-list">
                        <li className="user-info-item">
                            <span className="info-title">订单名称：</span>
                            <Input
                                autoComplete="off"
                                type="text"
                                value={editOrderName}
                                onChange={(e) => this.updateItemChange(e)}
                            />
                        </li>
                    </ul>
                </Modal>
            </div>
        )
    }
}

export default Order;