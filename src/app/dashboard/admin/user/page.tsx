"use client"
import { Users } from "@/app/api/[[...route]]/types/user";
import Modal from "@/components/modal";
import Navbar from "@/components/navbar";
import Splash from "@/components/splash";
import { UserData } from "@/context/UserData";
import { useEffect, useRef, useState } from "react";
import crypto from "crypto"

export default function AdminEditorPage(){
    let [userData, setUserData] = useState<Users>()
    let [load, setLoad] = useState(true)
    let [dataList, setDataList] = useState([] as Users[])
    let [modalDetail, setModalDetail] = useState(false)
    let [indexData, setIndexData] = useState(0)
    let [process, setProcess] = useState(false)
    let [changed, setChanged] = useState(false)
    let [newUser, setNewUser] = useState({
        username: "",
        password: "",
        role: "user",
        information: {
            fullname: "",
            email: "",
            phone: "",
            avatar: ""
        }
    } as Users)
    let [modalNewUser, setmodalNewUser] = useState(false)

    const ps = useRef({} as HTMLInputElement)

    useEffect(() => {
        fetch("/api/auth/")
            .then((r) => r.json())
            .then((json) => {
                if (json.status != "OK") document.location.href = "/signin"
                switch (json.data.role) {
                    case "instructor":
                        document.location.href = "/dashboard/instructor"
                        break
                    case "user":
                        document.location.href = "/dashboard/user"
                        break
                    case "admin":
                        setUserData(json.data)
                        setLoad(!load)
                        break
                }
            })
    }, [])

    function loadDataList(){
        fetch("/api/admin/", {
            method: "post",
            body: JSON.stringify({
                method: "GET_USER"
            })
        }).then((res) => res.json())
        .then((json) => {
            if(json.status != "FAIL") setDataList(json.data);
        })
    }

    useEffect(() => {
        loadDataList()
    }, [load])

    async function change(){
        setProcess(true)
        const res = await fetch("/api/admin/", {
            method: "POST",
            body: JSON.stringify({
                method: "MODIFY",
                data: dataList[indexData]
            })
        })
        const json = await res.json()
        if(json.status != "FAIL"){
            setProcess(false)
            loadDataList()
            setModalDetail(false)
        }
    }

    async function save(){
        setProcess(true)
        const res = await fetch("/api/admin/", {
            method: "POST",
            body: JSON.stringify({
                method: "ADD_USER",
                data: newUser
            })
        })
        const json = await res.json()
        if(json.status != "FAIL"){
            setProcess(false)
            loadDataList()
            setNewUser({
                username: "",
                password: "",
                role: "admin",
                information: {
                    fullname: "",
                    email: "",
                    phone: "",
                    avatar: ""
                }
            })
            ps.current.value = ""
            setmodalNewUser(false)
        }
    }

    async function remove(id: string){
        setLoad(true)
        const res = await fetch("/api/admin/", {
            method: "POST",
            body: JSON.stringify({
                method: "DELETE",
                data: {
                    id
                }
            })
        })
        const json = await res.json()
        if(json.status != "FAIL"){
            setLoad(false)
            loadDataList()
        }
    }

    return (
        <>
            <Splash isLoad={load}></Splash>
            <Modal className="bg-white px-5 py-2 rounded-md w-[40rem]" show={modalDetail} setShow={setModalDetail}>
                <div className="flex flex-col">
                    <div className="flex w-full justify-center">
                        <h3 className="my-2 font-bold text-xl text-gray-700">Detail</h3>
                    </div>
                    <h6 className="text-gray-700">Username</h6>
                    <input 
                        type="text" 
                        className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md" 
                        value={dataList.length != 0 ? dataList[indexData].username : ""} 
                        onChange={(ev) => {
                            setChanged(true)
                            const newDataList = [...dataList]
                            newDataList[indexData].username = ev.target.value
                            setDataList(newDataList)
                        }}
                    />
                    <h6 className="text-gray-700">Password</h6>
                    <input 
                        placeholder="Change Password" 
                        type="text" 
                        className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                        onChange={(ev) => {
                            setChanged(true)
                            const newDataList = [...dataList]
                            newDataList[indexData].password = crypto.createHash("sha256").update(ev.target.value).digest("hex")
                            setDataList(newDataList)
                        }}
                    />
                    <h6 className="text-gray-700">Fullname</h6>
                    <input 
                        type="text" 
                        className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md" 
                        value={dataList.length != 0 ? dataList[indexData].information.fullname : ""}
                        onChange={(ev) => {
                            setChanged(true)
                            const newDataList = [...dataList]
                            newDataList[indexData].information.fullname = ev.target.value
                            setDataList(newDataList)
                        }}
                    />
                    <h6 className="text-gray-700">Email</h6>
                    <input 
                        type="email" 
                        className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md" 
                        value={dataList.length != 0 ? dataList[indexData].information.email : ""}
                        onChange={(ev) => {
                            setChanged(true)
                            const newDataList = [...dataList]
                            newDataList[indexData].information.email = ev.target.value
                            setDataList(newDataList)
                        }}
                    />
                    <h6 className="text-gray-700">Phone</h6>
                    <input 
                        type="text" 
                        className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md" 
                        value={dataList.length != 0 ? dataList[indexData].information.phone : ""}
                        onChange={(ev) => {
                            setChanged(true)
                            const newDataList = [...dataList]
                            newDataList[indexData].information.phone = ev.target.value
                            setDataList(newDataList)
                        }}
                    />
                    {changed ? (
                        <>
                            <input 
                                type="submit" 
                                value="Change" 
                                className={"border border-slate-200 bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 mt-5 px-3 py-2 focus:outline-[#ff7854] rounded-md cursor-pointer" + (process? " hidden" : "")}
                                onClick={() => {
                                    change()
                                }}
                            />
                            <button className={"flex justify-center border border-slate-200 bg-[#ff4c1a] text-gray-100 focus:outline-[#ff7854] rounded-md cursor-pointer mt-5" + (process? "" : " hidden")} disabled>
                            <img
                                src={"/img/load.svg"}
                                alt="logo"
                                className="w-[1.5rem] object-contain my-2"
                            />
                            </button>
                        </>
                    ) : (
                        <button className="border border-slate-200 bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 mt-5 px-3 py-2 focus:outline-[#ff7854] rounded-md cursor-pointer"
                        onClick={() => setModalDetail(false)}>
                            Close
                        </button>
                    )}
                </div>
            </Modal>
            
            <Modal className="bg-white px-5 py-2 rounded-md w-[40rem]" show={modalNewUser} setShow={setmodalNewUser}>
                <div className="flex flex-col">
                    <div className="flex w-full justify-center">
                        <h3 className="my-2 font-bold text-xl text-gray-700">New User</h3>
                    </div>
                    <h6 className="text-gray-700">Username</h6>
                    <input 
                        type="text" 
                        className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md" 
                        value={newUser.username} 
                        onChange={(ev) => {
                            setChanged(true)
                            const newUserObject = {...newUser}
                            newUserObject.username = ev.target.value
                            setNewUser(newUserObject)
                        }}
                    />
                    <h6 className="text-gray-700">Password</h6>
                    <input 
                        placeholder="Change Password" 
                        type="text" 
                        ref={ps}
                        className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md"
                        onChange={(ev) => {
                            setChanged(true)
                            const newUserObject = {...newUser}
                            newUserObject.password = crypto.createHash("sha256").update(ev.target.value).digest("hex")
                            setNewUser(newUserObject)
                        }}
                    />
                    <h6 className="text-gray-700">Fullname</h6>
                    <input 
                        type="text" 
                        className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md" 
                        value={newUser.information.fullname} 
                        onChange={(ev) => {
                            setChanged(true)
                            const newUserObject = {...newUser}
                            newUserObject.information.fullname = ev.target.value
                            setNewUser(newUserObject)
                        }}
                    />
                    <h6 className="text-gray-700">Email</h6>
                    <input 
                        type="email" 
                        className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md" 
                        value={newUser.information.email} 
                        onChange={(ev) => {
                            setChanged(true)
                            const newUserObject = {...newUser}
                            newUserObject.information.email = ev.target.value
                            setNewUser(newUserObject)
                        }}
                    />
                    <h6 className="text-gray-700">Phone</h6>
                    <input 
                        type="text" 
                        className="border border-slate-200 px-3 py-2 focus:outline-[#ff7854] rounded-md" 
                        value={newUser.information.phone} 
                        onChange={(ev) => {
                            setChanged(true)
                            const newUserObject = {...newUser}
                            newUserObject.information.phone = ev.target.value
                            setNewUser(newUserObject)
                        }}
                    />
                    {changed ? (
                        <>
                            <input 
                                type="submit" 
                                value="Save" 
                                className={"border border-slate-200 bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 mt-5 px-3 py-2 focus:outline-[#ff7854] rounded-md cursor-pointer" + (process? " hidden" : "")}
                                onClick={() => {
                                    save()
                                }}
                            />
                            <button className={"flex justify-center border border-slate-200 bg-[#ff4c1a] text-gray-100 focus:outline-[#ff7854] rounded-md cursor-pointer mt-5" + (process? "" : " hidden")} disabled>
                            <img
                                src={"/img/load.svg"}
                                alt="logo"
                                className="w-[1.5rem] object-contain my-2"
                            />
                            </button>
                        </>
                    ) : (
                        <button className="border border-slate-200 bg-[#ff7854] hover:bg-[#ff4c1a] text-gray-100 mt-5 px-3 py-2 focus:outline-[#ff7854] rounded-md cursor-pointer"
                        onClick={() => setmodalNewUser(false)}>
                            Close
                        </button>
                    )}
                </div>
            </Modal>

            <div className={"bg-white w-full min-h-[100vh]"+ (load? " hidden": "")}>
                <UserData.Provider value={userData as Users}>
                    <Navbar/>
                </UserData.Provider>
                <div className="w-full z-0">
                    <div className="flex flex-col items-center">
                        <h2 className="mt-[7.5rem] mb-5 text-2xl font-semibold text-gray-600">User List</h2>
                        <div className="w-[50rem]">
                        <button 
                            className="border shadow-sm shadow-gray-200 w-[10rem] px-5 py-2 text-gray-600"
                            onClick={() => setmodalNewUser(!modalNewUser)}>
                            Add
                        </button>
                        <table className="my-5 rounded-md w-full border border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-gray-600 border py-2 px-2">Username</th>
                                        <th className="text-gray-600 border py-2 px-2">Fullname</th>
                                        <th className="text-gray-600 border py-2 px-2">Email</th>
                                        <th className="text-gray-600 border py-2 px-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataList.map((v: Users, i: number) => (
                                        <tr>
                                            <td className="text-gray-600 border py-2 px-2">{v.username}</td>
                                            <td className="text-gray-600 border py-2 px-2">{v.information.fullname}</td>
                                            <td className="text-gray-600 border py-2 px-2">{v.information.email}</td>
                                            <td className="text-gray-600 border py-2 px-2 flex flex-col">
                                                <button className="border border-slate-200 bg-blue-500 text-gray-100 focus:outline-[#ff7854] rounded-sm px-2 py-1 cursor-pointer"
                                                onClick={(e) => {
                                                    setIndexData(i)
                                                    setModalDetail(!modalDetail)
                                                }}>
                                                    Detail
                                                </button>
                                                <button 
                                                    className="border border-slate-200 bg-red-500 text-gray-100 focus:outline-[#ff7854] rounded-sm px-2 py-1 cursor-pointer"
                                                    onClick={() => {
                                                        remove(v._id as string)
                                                    }}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}