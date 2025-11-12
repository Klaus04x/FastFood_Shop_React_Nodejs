import React, { useState, useEffect, useContext } from 'react'
import './AddressBook.css'
import { storeContext } from '../../context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const AddressBook = () => {
    const { url, token } = useContext(storeContext)
    const [addresses, setAddresses] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        isDefault: false
    })

    // Fetch addresses
    const fetchAddresses = async () => {
        try {
            const response = await axios.post(`${url}/api/address/list`, {}, {
                headers: { token }
            })
            if (response.data.success) {
                setAddresses(response.data.addresses)
            }
        } catch (error) {
            console.error('Error fetching addresses:', error)
        }
    }

    useEffect(() => {
        if (token) {
            fetchAddresses()
        }
    }, [token])

    // Handle form input
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    // Open modal for adding new address
    const openAddModal = () => {
        setEditingAddress(null)
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            street: '',
            city: '',
            state: '',
            zipcode: '',
            country: '',
            isDefault: addresses.length === 0
        })
        setShowModal(true)
    }

    // Open modal for editing address
    const openEditModal = (address) => {
        setEditingAddress(address)
        setFormData({
            firstName: address.firstName,
            lastName: address.lastName,
            email: address.email,
            phone: address.phone,
            street: address.street,
            city: address.city,
            state: address.state,
            zipcode: address.zipcode,
            country: address.country,
            isDefault: address.isDefault
        })
        setShowModal(true)
    }

    // Save address (add or update)
    const handleSaveAddress = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
            !formData.street || !formData.city || !formData.state || !formData.zipcode || !formData.country) {
            toast.error('Please fill in all fields')
            return
        }

        try {
            let response
            if (editingAddress) {
                // Update existing address
                response = await axios.post(`${url}/api/address/update`, {
                    addressId: editingAddress._id,
                    address: formData
                }, {
                    headers: { token }
                })
            } else {
                // Add new address
                response = await axios.post(`${url}/api/address/add`, {
                    address: formData
                }, {
                    headers: { token }
                })
            }

            if (response.data.success) {
                toast.success(response.data.message)
                setAddresses(response.data.addresses)
                setShowModal(false)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error('Error saving address')
            console.error(error)
        }
    }

    // Delete address
    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm('Are you sure you want to delete this address?')) {
            return
        }

        try {
            const response = await axios.post(`${url}/api/address/delete`, {
                addressId
            }, {
                headers: { token }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                setAddresses(response.data.addresses)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error('Error deleting address')
            console.error(error)
        }
    }

    // Set default address
    const handleSetDefault = async (addressId) => {
        try {
            const response = await axios.post(`${url}/api/address/set-default`, {
                addressId
            }, {
                headers: { token }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                setAddresses(response.data.addresses)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error('Error setting default address')
            console.error(error)
        }
    }

    return (
        <div className='address-book'>
            <div className="address-book-header">
                <h2>My Addresses</h2>
                <button className="btn-add-address" onClick={openAddModal}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add New Address
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="empty-state">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#cbd5e0" strokeWidth="1.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    <p>No addresses saved yet</p>
                    <button className="btn-add-first" onClick={openAddModal}>Add Your First Address</button>
                </div>
            ) : (
                <div className="address-list">
                    {addresses.map((address) => (
                        <div key={address._id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                            {address.isDefault && (
                                <div className="default-badge">Default</div>
                            )}

                            <div className="address-info">
                                <h3>{address.firstName} {address.lastName}</h3>
                                <p className="address-line">{address.street}</p>
                                <p className="address-line">{address.city}, {address.state} {address.zipcode}</p>
                                <p className="address-line">{address.country}</p>
                                <p className="address-contact">Phone: {address.phone}</p>
                                <p className="address-contact">Email: {address.email}</p>
                            </div>

                            <div className="address-actions">
                                <button className="btn-action btn-edit" onClick={() => openEditModal(address)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                    </svg>
                                    Edit
                                </button>
                                <button className="btn-action btn-delete" onClick={() => handleDeleteAddress(address._id)}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    </svg>
                                    Delete
                                </button>
                                {!address.isDefault && (
                                    <button className="btn-action btn-default" onClick={() => handleSetDefault(address._id)}>
                                        Set as Default
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/>
                                    <line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>

                        <form className="address-form" onSubmit={handleSaveAddress}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="Enter first name"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Enter last name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter email"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter phone number"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Street Address *</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    placeholder="Enter street address"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter city"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="Enter state"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Zip Code *</label>
                                    <input
                                        type="text"
                                        name="zipcode"
                                        value={formData.zipcode}
                                        onChange={handleInputChange}
                                        placeholder="Enter zip code"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        placeholder="Enter country"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isDefault"
                                        checked={formData.isDefault}
                                        onChange={handleInputChange}
                                    />
                                    <span>Set as default address</span>
                                </label>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-save">
                                    {editingAddress ? 'Update Address' : 'Add Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddressBook
