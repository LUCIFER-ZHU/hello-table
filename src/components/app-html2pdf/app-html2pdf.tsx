import { AppViewBase, VueLifeCycleProcessing } from 'ibiz-vue';
import { Component } from 'vue-property-decorator';
import axios from 'axios';
import { getCookie } from 'qx-util';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { AppServiceBase } from 'ibiz-core';


/**
 * 问卷报告视图插件类
 *
 * @export
 * @class WjbgView
 * @extends {Vue}
 */
@Component({})
@VueLifeCycleProcessing()
export class WjbgView extends AppViewBase {
    /**
     * @description 后台数据
     */
    public data: any;

    /**
     * @description 水印数据
     */
    public waterMark: any;

    /**
     * @description 文件
     */    
    public files:any = [];

    /**
     * @description 报告数据
     */
    get reportData() {
        return this.data.data;
    }

    /**
     * 视图模型数据初始化实例
     */
    public async viewModelInit() {
        await super.viewModelInit();
        const res = await axios.post(`/qnreplies/${encodeURIComponent(this.context.qnreply)}/genpdf`, {});
        this.data = res.data;
        if (res.data.pdfurl) {
          this.files = JSON.parse(res.data.pdfurl)
        }
        this.handleWaterMark();
    }

    public viewMounted(): void {
        super.viewMounted();
        this.computeWaterMarkPosition();
    }

    /**
     * @description 处理水印信息
     */
    public handleWaterMark() {
        let loginname = getCookie('loginname');
        // 获取当前时间
        let nowDate = new Date();
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth() + 1 < 10 ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
        let day = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate();
        let dateStr = year + '-' + month + '-' + day;

        this.waterMark = {
            loginname: loginname,
            date: dateStr,
        };
    }

    /**
     * @description 给dom元素添加样式
     */
    public cssHelper(el: any, prototype: any) {
        for (let i in prototype) {
            el.style[i] = prototype[i];
        }
    }

    /**
     * @description 创建水印item
     */
    public createWaterMark() {
        const item = document.createElement('div');
        item.classList.add('watermark');
        item.innerHTML = this.waterMark.loginname + '<br/>' + this.waterMark.date;
        this.cssHelper(item, {
            fontSize: `16px`,
            color: '#000',
            lineHeight: 1.5,
            opacity: 0.1,
            transform: `rotate(-15deg)`,
            transformOrigin: '0 0',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '200px',
            height: '100px',
            flexShrink: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
        });
        return item;
    }

    /**
     * @description 计算水印位置
     */
    public computeWaterMarkPosition() {
        const waterHeight = 100;
        const waterWidth = 200;
        const wjbg: any = this.$refs.wjbg;
        const waterWrapper = document.createElement('div');
        waterWrapper.classList.add('water-wrapper');
        this.cssHelper(
            waterWrapper,
            Object.create({
                position: 'absolute',
                top: `-300px`,
                left: `-50px`,
                bottom: `-300px`,
                right: `-300px`,
                overflow: 'hidden',
                display: 'flex',
                flexWrap: 'wrap',
                pointerEvents: 'none',
            }),
        );
        wjbg.appendChild(waterWrapper);
        const { clientWidth, clientHeight } = wjbg;
        const column = Math.ceil(clientWidth / waterWidth) + 1;
        const rows = Math.ceil(clientHeight / waterHeight);
        for (let i = 0; i < column * rows; i++) {
            waterWrapper.appendChild(this.createWaterMark());
        }
    }

    /**
     * @description 可以转化所有小写数字为汉字
     * @param number
     * @return {*}
     */
    public numberChinese(number: any) {
        var units = '个十百千万@#%亿^&~',
            chars = '零一二三四五六七八九';
        var a: any = (number + '').split(''),
            s = [];
        if (a.length > 12) {
            throw new Error('too big');
        } else {
            for (var i = 0, j = a.length - 1; i <= j; i++) {
                if (j == 1 || j == 5 || j == 9) {
                    //两位数 处理特殊的 1*
                    if (i == 0) {
                        if (a[i] != '1') s.push(chars.charAt(a[i]));
                    } else {
                        s.push(chars.charAt(a[i]));
                    }
                } else {
                    s.push(chars.charAt(a[i]));
                }
                if (i != j) {
                    s.push(units.charAt(j - i));
                }
            }
        }
        //return s;
        return s
            .join('')
            .replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) {
                //优先处理 零百 零千 等
                b = units.indexOf(d);
                if (b != -1) {
                    if (d == '亿') return d;
                    if (d == '万') return d;
                    if (a[j - b] == '0') return '零';
                }
                return '';
            })
            .replace(/零+/g, '零')
            .replace(/零([万亿])/g, function (m, b) {
                // 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
                return b;
            })
            .replace(/亿[万千百]/g, '亿')
            .replace(/[零]$/, '')
            .replace(/[@#%^&~]/g, function (m) {
                return { '@': '十', '#': '百', '%': '千', '^': '十', '&': '百', '~': '千' }[m] as string;
            })
            .replace(/([亿万])([一-九])/g, function (m, d, b, c) {
                c = units.indexOf(d);
                if (c != -1) {
                    if (a[j - c] == '0') return d + '零' + b;
                }
                return m;
            });
    }

    /**
     * 下载文件路径
     *
     */
     public downloadUrl = AppServiceBase.getInstance().getAppEnvironment().ExportFile;

    /**
     * @description 下载pdf
     */    
    public downloadPDF(file:any) {
      const url = `${this.downloadUrl}/${file.id}`;
        // 发送get请求
        axios({
            method: 'get',
            url: url,
            responseType: 'blob'
        }).then((response: any) => {
            if (!response || response.status != 200) {
                this.$throw('下载PDF失败');
                return;
            }
            // 请求成功，后台返回的是一个文件流
            if (response.data) {
                // 获取文件名
                const filename = file.name;
                const ext = '.' + filename.split('.').pop();
                let filetype = "application/pdf";
                // 用blob对象获取文件流
                let blob = new Blob([response.data], {type: filetype});
                // 通过文件流创建下载链接
                var href = URL.createObjectURL(blob);
                // 创建一个a元素并设置相关属性
                let a = document.createElement('a');
                a.href = href;
                a.download = filename;
                // 添加a元素到当前网页
                document.body.appendChild(a);
                // 触发a元素的点击事件，实现下载
                a.click();
                // 从当前网页移除a元素
                document.body.removeChild(a);
                // 释放blob对象
                URL.revokeObjectURL(href);
            } else {
                this.$throw('下载PDF出错');
            }
        }).catch((error: any) => {
            console.error(error);
        });
    } 

    /**
     * 上传文件路径
     *
     */
    public uploadUrl = AppServiceBase.getInstance().getAppEnvironment().UploadFile;

    /**
     * @description 生成并下载pdf
     */
    public uploadPDF() {
        let content = document.querySelector('.wjbg-view');
        this.download(content);
    }

    /**
     * @description 下载pdf
     * @param content
     */
    public download(content: any) {
        html2canvas(content, {
            allowTaint: true,
            scale: 2, // 提升画面质量，但是会增加文件大小
        }).then((canvas: any) => {
            //未生成pdf的html页面高度
            let leftHeight = canvas.height;

            let a4Width = 210;
            let a4Height = 277; //A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
            //一页pdf显示html页面生成的canvas高度;
            let a4HeightRef = Math.floor((canvas.width / a4Width) * a4Height);

            //pdf页面偏移
            let position = 0;

            let pageData = canvas.toDataURL('image/jpeg', 1.0);

            let pdf = new jsPDF('p', 'mm', 'a4'); //A4纸，纵向
            let index = 1,
                canvas1 = document.createElement('canvas'),
                height;
            pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen');
            let timestamp = new Date().getTime();
            let pdfName = '答卷' + timestamp;
            function createImpl(canvas: any) {
                console.log(leftHeight, a4HeightRef);
                if (leftHeight > 0) {
                    index++;
                    let checkCount = 0;
                    if (leftHeight > a4HeightRef) {
                        let i = position + a4HeightRef;
                        for (i = position + a4HeightRef; i >= position; i--) {
                            let isWrite = true;
                            for (let j = 0; j < canvas.width; j++) {
                                let c = canvas.getContext('2d').getImageData(j, i, 1, 1).data;
                                if (c[0] != 0xff || c[1] != 0xff || c[2] != 0xff) {
                                    isWrite = false;
                                    break;
                                }
                            }
                            if (isWrite) {
                                checkCount++;
                                if (checkCount >= 10) {
                                    break;
                                }
                            } else {
                                checkCount = 0;
                            }
                        }
                        height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef);
                        if (height <= 0) {
                            height = a4HeightRef;
                        }
                    } else {
                        height = leftHeight;
                    }

                    canvas1.width = canvas.width;
                    canvas1.height = height;
                    console.log(index, 'height:', height, 'pos', position);

                    let ctx = canvas1.getContext('2d') as any;
                    ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width, height);

                    let pageHeight = Math.round((a4Width / canvas.width) * height);
                    if (position != 0) {
                        pdf.addPage();
                    }
                    pdf.addImage(
                        canvas1.toDataURL('image/jpeg', 1.0),
                        'JPEG',
                        10,
                        10,
                        a4Width,
                        (a4Width / canvas1.width) * height,
                    );
                    leftHeight -= height;
                    position += height;
                    if (leftHeight > 0) {
                        setTimeout(createImpl, 500, canvas);
                    } else {
                        pdf.save(pdfName + '.pdf');
                    }
                }
            }
            //当内容未超过pdf一页显示的范围，无需分页
            if (leftHeight < a4HeightRef) {
                pdf.addImage(pageData, 'JPEG', 0, 0, a4Width, (a4Width / canvas.width) * leftHeight);
                pdf.save(pdfName + '.pdf');
            } else {
                try {
                    pdf.deletePage(0);
                    setTimeout(createImpl, 500, canvas);
                } catch (err) {
                    // console.log(err);
                }
            }

            // 处理上传给后端
            var datauri = pdf.output('dataurlstring');
            var fd = new FormData();
            var fname = pdfName + '.pdf';
            var blob = this.dataURItoBlob(datauri);
            fd.append('file', blob, fname);
            axios.post(this.uploadUrl, fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res: any) => {
                const data = res.data;
                this.files = [];
                this.files.push({ name: data.filename, id: data.fileid });
                axios.put(`/qnreplies/${encodeURIComponent(this.context.qnreply)}`, {pdfurl:JSON.stringify(this.files)}).then((res2:any)=>{
                  
                })
            });
        });
    }

    /**
     * @description base64转二进制
     * @param dataURI
     * @return {*} 
     */
    public dataURItoBlob(dataURI: any) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    };

    /**
     * @description 绘制
     * @return {*}
     */
    public render() {
        if (!this.viewIsLoaded || !this.data) {
            return null;
        }
        return (
            <div class='wjbg-view' ref='wjbg'>
                <div class="btns">
                  <button class='create-pdf' on-click={() => this.uploadPDF()}>
                      生成并下载
                  </button>
                  {this.files.length > 0 ? this.files.map((file:any)=>{
                    return <button on-click={() => this.downloadPDF(file)}>{file.name}</button>
                  }):null}
                </div>
                <div class='title'>{this.data.qnsheetname}</div>
                <div class='sub-title'>
                    <div class='bm'>部门：{this.reportData.deptName}</div>
                    <div class='bgr'>报告人：{this.reportData.userName}</div>
                </div>
                <div class='one-part'>
                    <div class='one-part-title'>第一部分 合规风险分布</div>
                    <div class='one-part-body'>
                        <div class='one-part-body-title'>各部分风险占比</div>
                        <div class='one-part-body-body'>
                            {this.reportData.rateData.length > 0
                                ? this.reportData.rateData.map((item: any, index: number) => {
                                      return [
                                          <div class='body'>
                                              <div class='top'>
                                                  <div class='number'>({this.numberChinese(index + 1)})</div>
                                                  <div class='text'>{item.chaptername}</div>
                                              </div>
                                              <div class='bottom'>
                                                  <div class='number'>{item.errorRate}</div>
                                              </div>
                                          </div>,
                                      ];
                                  })
                                : null}
                        </div>
                    </div>
                </div>
                <div class='two-part'>
                    <div class='two-part-title'>第二部分 合规风险分析</div>
                    <div class='two-part-body'>
                        {this.reportData.errorData.length > 0
                            ? this.reportData.errorData.map((item: any) => {
                                  return [
                                      <div class='body'>
                                          <div class='chaptername'>{item.chaptername}</div>
                                          {item.subjects
                                              ? item.subjects.map((subject: any) => {
                                                    return [
                                                        <div class='subject'>
                                                            {subject.subjectname ? (
                                                                <div class='subjectname'>{subject.subjectname}</div>
                                                            ) : null}
                                                            {subject.memo ? (
                                                                <div
                                                                    class='memo'
                                                                    domPropsInnerHTML={subject.memo}
                                                                ></div>
                                                            ) : null}
                                                            <div class='answer'>
                                                                您本题的选择：<span class='text'>{subject.answer}</span>
                                                            </div>
                                                            <div class='analysis'>
                                                                不合规理由：<span class='text'>{subject.analysis}</span>
                                                            </div>
                                                        </div>,
                                                    ];
                                                })
                                              : null}
                                      </div>,
                                  ];
                              })
                            : null}
                    </div>
                </div>
            </div>
        );
    }
}
