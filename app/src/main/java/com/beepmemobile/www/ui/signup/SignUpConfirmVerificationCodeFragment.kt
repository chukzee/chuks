package com.beepmemobile.www.ui.signup

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.viewModels

import com.beepmemobile.www.R
import com.beepmemobile.www.databinding.SignUpConfirmVerificationCodeFragmentBinding
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.data.*;

class SignUpConfirmVerificationCodeFragment : Fragment() {
    private val model: SignUpConfirmVerificationCodeViewModel by viewModels()

    private var _binding: SignUpConfirmVerificationCodeFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = SignUpConfirmVerificationCodeFragment()
    }


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = SignUpConfirmVerificationCodeFragmentBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

    }

}
